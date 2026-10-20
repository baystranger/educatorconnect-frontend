import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, Button, EmptyState, ErrorState, Pill, Skeleton, Tabs, Textarea } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useUnsavedChanges } from '../../context/UnsavedChangesContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { getFamilies, getFamilyRequest, replyToFamily, setFamilyRequestStatus } from '../../services/centreApi.js';
import { ageLabel, formatDateTime, timeAgo } from '../../utils/format.js';
import { icsDataUrl } from '../../utils/calendar.js';
import './centre.css';

const TABS = [['inquiry', 'Inquiries'], ['tour', 'Tour requests'], ['waitlist', 'Waitlist']];
const STATUS = {
  new: ['New', 'danger'], replied: ['Replied', 'purple'], confirmed: ['Confirmed', 'green'],
  waitlisted: ['On waitlist', 'green'], declined: ['Declined', 'muted'], closed: ['Closed', 'muted'],
};
const ACTIONS = {
  inquiry: [['closed', 'Mark resolved']],
  tour: [['confirmed', 'Confirm tour'], ['declined', 'Decline']],
  waitlist: [['waitlisted', 'Add to waitlist'], ['declined', 'Decline']],
};

function RequestDetail({ id, centreName, onUpdated }) {
  const toast = useToast();
  const { data: request, loading, error, reload, setData } = useResource((signal) => getFamilyRequest(id, { signal }), [id]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(null);
  const threadRef = useRef(null);

  useEffect(() => { setReply(''); }, [id]);
  useUnsavedChanges(Boolean(reply.trim()), {
    message: 'You have an unsent reply to this family. Leaving will discard it.',
    onDiscard: () => setReply(''),
  });
  useEffect(() => { threadRef.current?.scrollTo(0, threadRef.current.scrollHeight); }, [request?.messages?.length]);

  if (loading && !request) return <section className="fm-detail"><div className="fm-detail-head"><Skeleton height={50} /><Skeleton height={60} /></div></section>;
  if (error) return <section className="fm-detail"><ErrorState error={error} onRetry={reload} /></section>;
  if (!request) return null;

  const [statusLabel, statusTone] = STATUS[request.status] || STATUS.new;

  async function send(event) {
    event.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const response = await replyToFamily(request.id, reply.trim());
      setData((current) => ({ ...current, status: current.status === 'new' ? 'replied' : current.status, messages: [...current.messages, response.data] }));
      onUpdated({ id: request.id, status: request.status === 'new' ? 'replied' : request.status });
      setReply('');
      toast.success(response.message);
    } catch (requestError) {
      toast.error(requestError);
    } finally {
      setSending(false);
    }
  }

  async function setStatus(status) {
    setBusy(status);
    try {
      const response = await setFamilyRequestStatus(request.id, { status });
      setData(response.data);
      onUpdated({ id: request.id, status });
      toast.success(status === 'confirmed' ? 'Tour confirmed. Send the family a quick reply so they know.' : 'Updated.');
      if (status === 'confirmed' && !reply) setReply(`Hi ${request.parent_name.split(' ')[0]}, your tour on ${formatDateTime(request.requested_at)} is confirmed. We look forward to meeting you!`);
      if (status === 'waitlisted' && !reply) setReply(`Hi ${request.parent_name.split(' ')[0]}, you’re on our waitlist for the ${request.program_of_interest || 'program'}. We’ll be in touch as soon as a space opens.`);
    } catch (requestError) {
      toast.error(requestError);
    } finally {
      setBusy(null);
    }
  }

  const facts = [
    ['Child age', request.child_age],
    ['Program', request.program_of_interest],
    [request.type === 'tour' ? 'Requested time' : 'Desired start', request.type === 'tour' ? formatDateTime(request.requested_at) : request.desired_start],
    ['Contact by', request.preferred_contact_method?.label],
  ].filter(([, value]) => value);

  return (
    <section className="fm-detail" aria-label={`Request from ${request.parent_name}`}>
      <div className="fm-detail-head">
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2>{request.parent_name}</h2>
            <small>
              <a href={`mailto:${request.email}`}>{request.email}</a>
              {request.phone && <> · <a href={`tel:${request.phone}`}>{request.phone}</a></>}
              {request.preferred_contact_method && ` · prefers ${request.preferred_contact_method.label.toLowerCase()}`}
            </small>
          </div>
          <Pill tone={statusTone}>{statusLabel}</Pill>
        </div>
        {facts.length > 0 && <div className="ec-facts fm-facts">{facts.map(([label, value]) => <div className="ec-fact" key={label}><span>{label}</span><span>{value}</span></div>)}</div>}
        <div className="ec-row-flex ec-wrap" style={{ justifyContent: 'space-between', gap: 12 }}>
          {request.has_consent && <span className="fm-consent">✓ Parent gave consent to share these details with your centre</span>}
          <span className="fm-status-actions">
            {ACTIONS[request.type].filter(([status]) => status !== request.status).map(([status, label]) => (
              <Button key={status} size="xs" variant={status === 'declined' ? 'danger' : 'soft'} loading={busy === status} onClick={() => setStatus(status)}>{label}</Button>
            ))}
            {request.type === 'tour' && request.requested_at && (
              <Button size="xs" variant="outline" href={icsDataUrl({ title: `Tour · ${request.parent_name}`, start: request.requested_at, durationMinutes: 30, location: centreName, description: request.message || '' })} download="tour.ics">Add to calendar</Button>
            )}
          </span>
        </div>
      </div>
      <div className="ap-thread" ref={threadRef} style={{ maxHeight: 'none' }}>
        {request.message && (
          <div className="ap-bubble-wrap is-theirs"><div className="ap-bubble">{request.message}</div><small>{timeAgo(request.created_at)}</small></div>
        )}
        {!request.message && <span className="ec-muted" style={{ fontSize: 14 }}>{request.parent_name} didn’t add a message.</span>}
        {request.messages.map((message) => (
          <div key={message.id} className="ap-bubble-wrap is-mine"><div className="ap-bubble">{message.body}</div><small>{timeAgo(message.created_at)} · emailed to {request.email}</small></div>
        ))}
      </div>
      <form className="ap-compose" onSubmit={send}>
        <div className="ap-compose-row">
          <Textarea rows={2} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply…" aria-label="Reply" maxLength={5000} />
          <Button type="submit" loading={sending} disabled={!reply.trim()}>Send reply</Button>
        </div>
      </form>
    </section>
  );
}

export default function FamiliesPage() {
  useDocumentTitle('Families');
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some(([key]) => key === params.get('tab')) ? params.get('tab') : 'inquiry';
  const selectedId = Number(params.get('request')) || null;
  const { data: requests, meta, loading, error, reload, setData } = useResource((signal) => getFamilies(tab, { signal }), [tab]);
  const activeId = selectedId || (window.matchMedia('(min-width: 761px)').matches ? requests?.[0]?.id : null);

  return (
    <main className="ec-main" style={{ paddingTop: 28 }}>
      <div className="ec-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">Families</h1>
            <p className="ec-sub">Questions, tour requests and waitlist sign-ups from your public profile.</p>
          </div>
          <span className="ec-muted" style={{ fontSize: 14 }}>Parents get an email copy of every reply.</span>
        </div>

        <Tabs label="Families" value={tab} onChange={(key) => setParams({ tab: key }, { replace: true })}
          tabs={TABS.map(([key, label]) => ({ key, label, count: meta?.counts?.[key] ?? '…' }))} />

        <div className={`fm-layout ${selectedId ? 'has-selection' : ''}`}>
          <section className="fm-list" aria-label="Requests">
            {loading && !requests && [0, 1, 2].map((key) => <div className="fm-item" key={key}><Skeleton height={56} /></div>)}
            {error && <ErrorState error={error} onRetry={reload} />}
            {!error && requests?.length === 0 && (
              <EmptyState title={`No ${TABS.find(([key]) => key === tab)[1].toLowerCase()} yet`}>Families contact you from your public centre profile — no account needed on their side.</EmptyState>
            )}
            {!error && requests?.map((request) => (
              <button key={request.id} type="button" className="fm-item" aria-current={request.id === activeId ? 'true' : 'false'} onClick={() => setParams({ tab, request: request.id }, { replace: true })}>
                <Avatar initials={request.initials} name={request.parent_name} size={40} round />
                <span>
                  <span className="fm-item-top"><strong>{request.parent_name}</strong><small>{ageLabel(request.created_at)}</small></span>
                  <span className="fm-sub">{[request.child_age, request.program_of_interest && `${request.program_of_interest} program`, request.type === 'tour' && request.requested_at && formatDateTime(request.requested_at)].filter(Boolean).join(' · ')}</span>
                  {request.message && <span className="fm-preview">{request.message}</span>}
                </span>
                {request.status === 'new' && <span className="ap-unseen" aria-label="New" style={{ marginTop: 6 }} />}
              </button>
            ))}
          </section>
          {activeId && (
            <>
              {selectedId && <Button size="xs" variant="secondary" className="ap-back fm-back" onClick={() => setParams({ tab }, { replace: true })}>← All requests</Button>}
              <RequestDetail key={activeId} id={activeId} centreName={user?.childcare_centres?.[0]?.name || ''}
                onUpdated={(changes) => setData((current) => current.map((item) => (item.id === changes.id ? { ...item, ...changes } : item)))} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
