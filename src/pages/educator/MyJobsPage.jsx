import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, Button, EmptyState, ErrorState, FilterPills, Icon, Modal, Pill, Skeleton, StepBars, Tabs } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useUnsavedChanges } from '../../context/UnsavedChangesContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useLiveRefresh } from '../../hooks/useLiveRefresh.js';
import { useResource } from '../../hooks/useResource.js';
import { getMyApplications, getSavedJobs, replyToCentre, unsaveJob, withdrawApplication } from '../../services/educatorApi.js';
import { daysUntil, formatDateTime, formatShortDate, km, STATUS_TONES, timeAgo } from '../../utils/format.js';
import './my-jobs.css';

const FILTERS = [['all', 'All'], ['in_progress', 'In progress'], ['interviews', 'Interviews'], ['offers', 'Offers'], ['closed', 'Closed']];
const EMPTY = {
  all: 'You haven’t applied to any jobs yet.',
  in_progress: 'No applications in progress.',
  interviews: 'No interviews yet. They’ll appear here when a centre invites you.',
  offers: 'Nothing here yet. Offers will appear here when a centre makes one.',
  closed: 'No closed applications.',
};

function Timeline({ application }) {
  return (
    <div className="mj-timeline">
      <span className="mj-label">Timeline</span>
      {application.timeline.map((event, index) => (
        <div className="mj-event" key={`${event.status}-${event.at}`}>
          <i style={{ background: index === 0 ? (application.is_closed ? '#8A8496' : '#42007B') : '#CFC6D6' }} />
          <span>
            <strong>{event.status === 'interview' && application.interview ? `Interview scheduled — ${formatDateTime(application.interview.at)}` : event.label}</strong>
            <small>{timeAgo(event.at) === 'Just now' ? 'Today' : formatShortDate(event.at)}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function ApplicationRow({ application, open, onToggle, onWithdraw }) {
  const toast = useToast();
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState(application.messages || []);
  // A live refresh brings new centre replies; adopt them unless the server copy is behind.
  useEffect(() => {
    if (application.messages) setMessages((current) => (application.messages.length >= current.length ? application.messages : current));
  }, [application.messages]);
  useUnsavedChanges(Boolean(reply.trim()), {
    message: 'You have an unsent reply to a centre. Leaving will discard it.',
    onDiscard: () => setReply(''),
  });
  const [sending, setSending] = useState(false);
  const lastCentreMessage = [...messages].reverse().find((message) => message.sender_role === 'centre');

  async function sendReply(event) {
    event.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const payload = await replyToCentre(application.id, reply.trim());
      setMessages((current) => [...current, payload.data]);
      setReply('');
      toast.success('Message sent.');
    } catch (error) {
      toast.error(error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mj-item">
      <button type="button" className="mj-row" aria-expanded={open ? 'true' : 'false'} onClick={onToggle}>
        <span className="mj-job">
          <Avatar initials={application.job?.centre?.initials} name={application.job?.centre?.name} />
          <span><strong>{application.job?.title}</strong><small>{application.job?.centre?.name} · {application.job?.employment_type?.label}</small></span>
        </span>
        <span className="mj-date">{formatShortDate(application.applied_at)}</span>
        <span className="mj-progress">
          <StepBars step={application.is_closed ? Math.max(1, application.timeline.length - 1) : application.step} total={6} closed={application.is_closed} />
          <small>{application.is_closed ? 'Closed' : `Step ${application.step} of 6 · ${application.status.label}`}</small>
        </span>
        <Pill tone={STATUS_TONES[application.status.key]}>{application.status.label}</Pill>
        <Icon name="chevronDown" size={18} strokeWidth={2.2} style={{ color: '#5C566A', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
      </button>
      {open && (
        <div className="mj-detail">
          <Timeline application={application} />
          <div className="mj-side">
            {application.interview && (
              <div className="mj-note">
                <strong>Interview details</strong>
                <span>{formatDateTime(application.interview.at)}{application.interview.location ? ` · ${application.interview.location}` : ''}</span>
                {application.interview.details && <span>{application.interview.details}</span>}
              </div>
            )}
            {lastCentreMessage && (
              <div className="mj-note">
                <strong>Message from the centre</strong>
                <span>{lastCentreMessage.body}</span>
              </div>
            )}
            {messages.length > 0 && (
              <form className="mj-reply" onSubmit={sendReply}>
                <textarea className="ec-textarea" rows={2} placeholder={`Reply to ${application.job?.centre?.name}…`} value={reply} onChange={(event) => setReply(event.target.value)} maxLength={5000} aria-label="Reply to the centre" />
                <Button size="sm" type="submit" loading={sending} disabled={!reply.trim()}>Send reply</Button>
              </form>
            )}
            <div className="mj-actions">
              <Button size="sm" to={`/educator/jobs?job=${application.job?.slug}`}>View job</Button>
              {application.can_withdraw && <Button size="sm" variant="danger" onClick={() => onWithdraw(application)}>Withdraw</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SavedJobs({ onCount }) {
  const toast = useToast();
  const { data: jobs, loading, error, reload, setData } = useResource((signal) => getSavedJobs({ signal }), []);
  useLiveRefresh(reload);

  async function remove(job) {
    setData((current) => current.filter((item) => item.id !== job.id));
    onCount((count) => Math.max(0, count - 1));
    try {
      await unsaveJob(job.id);
      toast.success('Removed from saved jobs.');
    } catch (requestError) {
      toast.error(requestError);
      reload({ silent: true });
    }
  }

  if (loading) return <div className="mj-saved">{[0, 1, 2].map((key) => <Skeleton key={key} height={170} style={{ borderRadius: 18 }} />)}</div>;
  if (error) return <div className="ec-card"><ErrorState error={error} onRetry={reload} /></div>;
  if (!jobs.length) {
    return <div className="ec-card"><EmptyState title="No saved jobs" action={<Button size="sm" to="/educator/jobs">Find jobs</Button>}>Tap the bookmark on any job to keep it here.</EmptyState></div>;
  }

  return (
    <div className="mj-saved">
      {jobs.map((job) => {
        const days = daysUntil(job.application_deadline);
        const soon = days !== null && days <= 3;
        return (
          <article className="mj-saved-card" key={job.id}>
            <div className="mj-saved-top">
              <Avatar initials={job.centre?.initials} name={job.centre?.name} src={job.centre?.logo_url} />
              <span><strong>{job.title}</strong><small>{[job.centre?.name, km(job.distance_km) || job.city].filter(Boolean).join(' · ')}</small></span>
            </div>
            <div className="mj-saved-meta">
              <Pill size="sm" tone="purple">{job.employment_type?.label}</Pill>
              <span style={{ color: soon ? '#B42318' : '#5C566A' }}>
                {job.status !== 'published' ? 'No longer open' : days === null ? 'Open until filled' : days < 0 ? 'Closed' : days === 0 ? 'Closes today' : soon ? `Closes in ${days} ${days === 1 ? 'day' : 'days'}` : `Apply by ${formatShortDate(job.application_deadline)}`}
              </span>
            </div>
            <div className="mj-saved-actions">
              {job.has_applied
                ? <Button size="sm" variant="soft" to="/educator/my-jobs">Applied</Button>
                : <Button size="sm" to={`/educator/jobs?job=${job.slug}`}>Apply</Button>}
              <Button size="sm" variant="outline" onClick={() => remove(job)}>Remove</Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function MyJobsPage() {
  useDocumentTitle('My jobs');
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'saved' ? 'saved' : 'applications';
  const filter = FILTERS.some(([key]) => key === params.get('filter')) ? params.get('filter') : 'all';
  const focusId = Number(params.get('application')) || null;
  const { data, meta, loading, error, reload, setData } = useResource((signal) => getMyApplications(filter, { signal }), [filter]);
  useLiveRefresh(reload);
  const [openId, setOpenId] = useState(focusId);
  const [savedCount, setSavedCount] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => { if (meta) setSavedCount((current) => current ?? meta.saved_count); }, [meta]);
  useEffect(() => {
    if (!data?.length) return;
    setOpenId((current) => current ?? data[0].id);
  }, [data]);

  const set = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  async function confirmWithdraw() {
    setWithdrawing(true);
    try {
      const payload = await withdrawApplication(confirm.id);
      setData((current) => current.map((item) => (item.id === confirm.id ? { ...payload.data, messages: item.messages } : item)));
      toast.success('Application withdrawn.');
      setConfirm(null);
      reload({ silent: true });
    } catch (requestError) {
      toast.error(requestError);
    } finally {
      setWithdrawing(false);
    }
  }

  return (
    <main className="ec-main">
      <div className="ec-container" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">My jobs</h1>
            <p className="ec-sub">Track every application and keep the jobs you’re considering in one place.</p>
          </div>
          <div className="ec-actions"><Button to="/educator/jobs">Find more jobs</Button></div>
        </div>

        <Tabs
          label="My jobs"
          value={tab}
          onChange={(key) => set({ tab: key === 'saved' ? 'saved' : '', application: '' })}
          tabs={[
            { key: 'applications', label: 'Applications', count: meta?.counts?.all ?? '…' },
            { key: 'saved', label: 'Saved jobs', count: savedCount ?? '…' },
          ]}
        />

        {tab === 'saved' ? <SavedJobs onCount={setSavedCount} /> : (
          <div className="ec-stack-sm" style={{ gap: 16 }}>
            <FilterPills label="Filter applications" value={filter} onChange={(key) => set({ filter: key === 'all' ? '' : key, application: '' })} options={FILTERS.map(([key, label]) => ({ key, label }))} />
            <section className="ec-card mj-table">
              <div className="ec-table-head mj-grid"><span>Job</span><span>Applied</span><span>Progress</span><span>Status</span><span /></div>
              {loading && !data && [0, 1, 2].map((key) => <div className="mj-item" key={key}><div className="mj-row"><Skeleton height={44} /></div></div>)}
              {error && <ErrorState error={error} onRetry={reload} />}
              {!error && data?.length === 0 && (
                <EmptyState action={filter === 'all' ? <Button size="sm" to="/educator/jobs">Find jobs</Button> : null}>{EMPTY[filter]}</EmptyState>
              )}
              {!error && data?.map((application) => (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  open={openId === application.id}
                  onToggle={() => setOpenId(openId === application.id ? null : application.id)}
                  onWithdraw={setConfirm}
                />
              ))}
            </section>
            <p className="ec-muted" style={{ margin: 0, fontSize: 13.5 }}>Statuses: New → Reviewed → Shortlisted → Interview → Offered → Hired / Not selected. Centres update these as they review.</p>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(confirm)}
        title="Withdraw this application?"
        onClose={() => setConfirm(null)}
        footer={<><Button variant="outline" onClick={() => setConfirm(null)}>Keep it</Button><Button variant="danger-solid" loading={withdrawing} onClick={confirmWithdraw}>Withdraw</Button></>}
      >
        <p className="ec-muted" style={{ margin: 0 }}>
          {confirm?.job?.centre?.name} will see that you withdrew from <strong>{confirm?.job?.title}</strong>. You can apply again while the posting is open.
        </p>
      </Modal>
    </main>
  );
}
