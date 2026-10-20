import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar, Button, EmptyState, ErrorState, Field, Icon, Input, Modal, PageLoader, Pill, Skeleton, Textarea } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useUnsavedChanges } from '../../context/UnsavedChangesContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { downloadApplicantResume, getApplicant, getApplicants, getCentreJobs, messageApplicant, setApplicantStatus } from '../../services/centreApi.js';
import { formatDateTime, formatTime, km, relativeDay, STATUS_TONES, toDate } from '../../utils/format.js';
import './centre.css';

const STAGES = [['new', 'New'], ['reviewed', 'Reviewed'], ['shortlisted', 'Shortlisted'], ['interview', 'Interview'], ['offered', 'Offered'], ['hired', 'Hired'], ['not_selected', 'Not selected']];

function templates(centreName, applicant) {
  const first = applicant?.educator?.name?.split(' ')[0] || 'there';
  return [
    ['Invite to interview', `Hi ${first}, thank you for applying! We’d love to meet you. Are you available for an interview this week? Let us know a few times that work.`],
    ['Request references', `Hi ${first}, thanks for your application. Could you share two professional references (name, role and contact details)?`],
    ['Thank you / not selected', `Hi ${first}, thank you for your interest in ${centreName}. We’ve decided to move forward with other candidates for this role, but we’d welcome your application for future openings.`],
  ];
}

function InterviewModal({ applicant, defaultLocation, onClose, onSaved }) {
  const toast = useToast();
  const tomorrow = new Date(Date.now() + 86400000);
  tomorrow.setHours(10, 0, 0, 0);
  const local = (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const [form, setForm] = useState({
    interview_at: applicant.interview?.at ? local(toDate(applicant.interview.at)) : local(tomorrow),
    interview_location: applicant.interview?.location || defaultLocation || '',
    interview_details: applicant.interview?.details || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setError('');
    try {
      const response = await setApplicantStatus(applicant.id, { status: 'interview', ...form, interview_at: new Date(form.interview_at).toISOString() });
      toast.success(response.message);
      onSaved(response.data);
    } catch (requestError) {
      setError(requestError.field('interview_at') || requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open title={`Interview with ${applicant.educator.name}`} onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={saving} onClick={save}>Schedule &amp; notify</Button></>}>
      <Field label="Date and time" error={error}><Input type="datetime-local" value={form.interview_at} onChange={(event) => setForm({ ...form, interview_at: event.target.value })} /></Field>
      <Field label="Location" hint="or video link"><Input value={form.interview_location} onChange={(event) => setForm({ ...form, interview_location: event.target.value })} maxLength={255} /></Field>
      <Field label="Details for the educator" hint="optional"><Textarea rows={3} value={form.interview_details} onChange={(event) => setForm({ ...form, interview_details: event.target.value })} placeholder="Ask for Anita (Director). Bring your certificates." maxLength={1000} /></Field>
      <p className="ec-muted" style={{ margin: 0, fontSize: 13.5 }}>{applicant.educator.name.split(' ')[0]} gets an email and in-app notification with these details.</p>
    </Modal>
  );
}

function ApplicantDetail({ applicationId, centre, onChanged }) {
  const toast = useToast();
  const { data: applicant, loading, error, reload, setData } = useResource((signal) => getApplicant(applicationId, { signal }), [applicationId]);
  const [busy, setBusy] = useState(null);
  const [interviewing, setInterviewing] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [playing, setPlaying] = useState(false);
  const threadRef = useRef(null);

  useEffect(() => { setPlaying(false); setMessage(''); }, [applicationId]);
  useUnsavedChanges(Boolean(message.trim()), {
    message: 'You have an unsent message to this applicant. Leaving will discard it.',
    onDiscard: () => setMessage(''),
  });
  useEffect(() => { threadRef.current?.scrollTo(0, threadRef.current.scrollHeight); }, [applicant?.messages?.length]);

  if (loading && !applicant) return <><div className="ap-detail"><Skeleton height={60} /><Skeleton height={124} /><Skeleton height={120} /></div><div className="ap-messages"><Skeleton height={300} /></div></>;
  if (error) return <div className="ap-detail"><ErrorState error={error} onRetry={reload} /></div>;
  if (!applicant) return null;

  const educator = applicant.educator;

  async function move(status) {
    if (status === 'interview') { setInterviewing(true); return; }
    setBusy(status);
    try {
      const response = await setApplicantStatus(applicant.id, { status });
      setData(response.data);
      onChanged(response.data);
      toast.success(response.message);
    } catch (requestError) {
      toast.error(requestError);
    } finally {
      setBusy(null);
    }
  }

  async function send(event) {
    event?.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const response = await messageApplicant(applicant.id, message.trim());
      setData((current) => ({ ...current, messages: [...current.messages, response.data] }));
      setMessage('');
      toast.success(response.message);
    } catch (requestError) {
      toast.error(requestError);
    } finally {
      setSending(false);
    }
  }

  const thread = [
    ...(applicant.cover_message ? [{ id: 'cover', is_mine: false, body: applicant.cover_message, created_at: applicant.applied_at }] : []),
    ...applicant.messages,
  ];
  const closed = ['hired', 'not_selected', 'withdrawn'].includes(applicant.status.key);

  return (
    <>
      <section className="ap-detail" aria-label={`Applicant ${educator.name}`}>
        <div className="ap-detail-head">
          <Avatar initials={educator.initials} name={educator.name} size={60} round />
          <div>
            <h2>{educator.name}</h2>
            <small>{[educator.title, km(educator.distance_km), `Applied ${relativeDay(applicant.applied_at)}`].filter(Boolean).join(' · ')}</small>
          </div>
          <Pill tone={STATUS_TONES[applicant.status.key]}>{applicant.status.label}</Pill>
        </div>

        <div className="ap-detail-actions">
          {applicant.next_status && !closed && (
            <Button size="sm" loading={busy === applicant.next_status.key} onClick={() => move(applicant.next_status.key)}>
              {applicant.next_status.key === 'interview' ? 'Invite to interview →' : `Move to ${applicant.next_status.label} →`}
            </Button>
          )}
          {applicant.status.key === 'interview' && <Button size="sm" variant="outline" onClick={() => setInterviewing(true)}>Reschedule</Button>}
          {!closed && <Button size="sm" variant="danger" loading={busy === 'not_selected'} onClick={() => move('not_selected')}>Not selected</Button>}
          {applicant.status.key === 'not_selected' && <Button size="sm" variant="outline" loading={busy === 'reviewed'} onClick={() => move('reviewed')}>Reconsider</Button>}
          {educator.has_resume && (
            <Button size="sm" variant="outline" style={{ color: '#42007B' }} onClick={() => downloadApplicantResume(applicant.id, educator.resume_name).catch((e) => toast.error(e))}>Download résumé</Button>
          )}
        </div>

        {applicant.status.key === 'withdrawn' && <div className="ec-alert ec-alert-warning">{educator.name.split(' ')[0]} withdrew this application.</div>}
        {applicant.interview && applicant.status.key === 'interview' && (
          <div className="ec-alert ec-alert-info"><strong>Interview:</strong> {formatDateTime(applicant.interview.at)}{applicant.interview.location ? ` · ${applicant.interview.location}` : ''}</div>
        )}

        <div className="ap-intro">
          {educator.introduction_video_url ? (
            playing ? (
              <div className="ap-video">{/* eslint-disable-next-line jsx-a11y/media-has-caption */}<video src={educator.introduction_video_url} controls autoPlay playsInline /></div>
            ) : (
              <button type="button" className="ap-video" onClick={() => setPlaying(true)} aria-label={`Play ${educator.name}’s intro video`}>
                <span><Icon name="play" size={18} fill="currentColor" strokeWidth={0} /></span><span>Intro video</span>
              </button>
            )
          ) : (
            <div className="ap-video" style={{ background: '#F4F2F6', color: '#5C566A', cursor: 'default', fontSize: 13.5, textAlign: 'center', padding: 12 }}>No intro video shared</div>
          )}
          <p className="ap-summary">{educator.summary || 'This educator hasn’t written a summary yet.'}</p>
        </div>

        <div className="ec-facts ap-facts">
          {[
            ['Experience', educator.years_experience != null ? `${educator.years_experience} ${educator.years_experience === 1 ? 'yr' : 'yrs'}` : '—'],
            ['Distance', km(educator.distance_km) || '—'],
            ['Looking for', educator.looking_for.map((item) => item.label).join(', ') || '—'],
            ['Availability', [educator.availability.join(', '), educator.available_from && toDate(educator.available_from).toLocaleDateString('en-CA', { month: 'short' })].filter(Boolean).join(' · ') || '—'],
            ['Languages', educator.languages.join(', ') || '—'],
            ['Résumé', educator.has_resume ? (educator.resume_name?.split('.').pop()?.toUpperCase() || 'Attached') : 'Not uploaded'],
          ].map(([label, value]) => <div className="ec-fact" key={label}><span>{label}</span><span>{value}</span></div>)}
        </div>
        {educator.credentials.length > 0 && (
          <div className="ap-creds">{educator.credentials.map((item) => <span key={item} className="ec-pill tone-green" style={{ fontWeight: 600 }}>✓ {item}</span>)}</div>
        )}
        {educator.slug && <Link to={`/educators/${educator.slug}`} style={{ fontWeight: 700, fontSize: 14.5 }}>View full profile →</Link>}
      </section>

      <section className="ap-messages" aria-label="Messages">
        <div className="ap-messages-head"><strong>Messages</strong><span>Sent by email &amp; in-app</span></div>
        <div className="ap-thread" ref={threadRef}>
          {thread.length === 0 && <span className="ec-muted" style={{ fontSize: 14 }}>No messages yet. Start the conversation below.</span>}
          {thread.map((item) => (
            <div key={item.id} className={`ap-bubble-wrap ${item.is_mine ? 'is-mine' : 'is-theirs'}`}>
              <div className="ap-bubble">{item.body}</div>
              <small>{relativeDay(item.created_at) === 'today' ? `Today, ${formatTime(item.created_at)}` : `${relativeDay(item.created_at)}, ${formatTime(item.created_at)}`}</small>
            </div>
          ))}
        </div>
        <form className="ap-compose" onSubmit={send}>
          <div className="ap-templates">
            {templates(centre?.name || 'our centre', applicant).map(([label, text]) => (
              <button key={label} type="button" onClick={() => setMessage(text)}>{label}</button>
            ))}
          </div>
          <div className="ap-compose-row">
            <Textarea rows={2} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message…" aria-label="Message" maxLength={5000}
              onKeyDown={(event) => { if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) send(); }} />
            <Button type="submit" loading={sending} disabled={!message.trim()}>Send</Button>
          </div>
        </form>
      </section>

      {interviewing && (
        <InterviewModal applicant={applicant} defaultLocation={[centre?.address, centre?.city].filter(Boolean).join(', ')} onClose={() => setInterviewing(false)}
          onSaved={(updated) => { setInterviewing(false); setData(updated); onChanged(updated); }} />
      )}
    </>
  );
}

export default function ApplicantsPage() {
  useDocumentTitle('Applicants');
  const { user } = useAuth();
  const centre = user?.childcare_centres?.[0];
  const [params, setParams] = useSearchParams();
  const { data: jobs, loading: jobsLoading, error: jobsError, reload: reloadJobs } = useResource((signal) => getCentreJobs({ tab: 'active' }, { signal }), []);
  const jobId = Number(params.get('job')) || jobs?.find((job) => job.status === 'published')?.id || jobs?.[0]?.id || null;
  const stage = params.get('status') || '';
  const selectedId = Number(params.get('application')) || null;
  const { data: applicants, meta, loading, error, reload, setData } = useResource(
    (signal) => getApplicants(jobId, stage || undefined, { signal }), [jobId, stage], { enabled: Boolean(jobId) },
  );
  const activeId = selectedId || (window.matchMedia('(min-width: 761px)').matches ? applicants?.[0]?.id : null);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  if (jobsLoading) return <PageLoader label="Loading applicants…" />;
  if (jobsError) return <main className="ec-main"><div className="ec-container"><ErrorState error={jobsError} onRetry={reloadJobs} /></div></main>;
  if (!jobs?.length) {
    return (
      <main className="ec-main"><div className="ec-container ec-stack">
        <h1 className="ec-h1">Applicants</h1>
        <div className="ec-card"><EmptyState title="No postings yet" action={<Button size="sm" to="/centre/jobs/new">Post a job</Button>}>Applicants appear here once you publish a job.</EmptyState></div>
      </div></main>
    );
  }

  const job = jobs.find((item) => item.id === jobId);

  return (
    <main className="ec-main" style={{ paddingTop: 28 }}>
      <div className="ec-container" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="ec-page-head" style={{ alignItems: 'center' }}>
          <div className="ap-title">
            <h1 className="ec-h1">Applicants</h1>
            <span className="ec-muted">for</span>
            <select className="ec-select" value={jobId || ''} aria-label="Job posting" onChange={(event) => setParams({ job: event.target.value }, { replace: true })}>
              {jobs.filter((item) => item.status !== 'draft').map((item) => <option key={item.id} value={item.id}>{item.title} · {item.applicants_count}</option>)}
            </select>
          </div>
          {job?.status === 'published' && <Link to={`/jobs/${job.slug}`} style={{ fontWeight: 700, fontSize: 15 }}>View posting</Link>}
        </div>

        <div className="ap-stages" role="group" aria-label="Filter by stage">
          {STAGES.map(([key, label]) => (
            <button key={key} type="button" className="ap-stage" aria-pressed={stage === key ? 'true' : 'false'} onClick={() => update({ status: stage === key ? '' : key, application: '' })}>
              <span>{label}</span><span>{meta?.counts?.[key] ?? '–'}</span>
            </button>
          ))}
        </div>

        <div className={`ap-layout ${selectedId ? 'has-selection' : ''}`}>
          <section className="ap-list" aria-label="Applicants">
            {loading && !applicants && [0, 1, 2].map((key) => <div className="ap-person" key={key}><Skeleton height={42} /></div>)}
            {error && <ErrorState error={error} onRetry={reload} />}
            {!error && applicants?.length === 0 && <EmptyState>{stage ? 'No applicants at this stage.' : 'No applicants for this posting yet.'}</EmptyState>}
            {!error && applicants?.map((applicant) => (
              <button key={applicant.id} type="button" className="ap-person" aria-current={applicant.id === activeId ? 'true' : 'false'} onClick={() => { update({ application: applicant.id }); setData((current) => current.map((item) => (item.id === applicant.id ? { ...item, is_unseen: false } : item))); }}>
                <Avatar initials={applicant.educator.initials} name={applicant.educator.name} size={42} round />
                <span>
                  <strong>{applicant.educator.name}</strong>
                  <small>{[applicant.educator.years_experience != null && `${applicant.educator.years_experience} ${applicant.educator.years_experience === 1 ? 'yr' : 'yrs'}`, km(applicant.educator.distance_km), relativeDay(applicant.applied_at)].filter(Boolean).join(' · ')}</small>
                </span>
                {applicant.is_unseen && <span className="ap-unseen" aria-label="New" />}
              </button>
            ))}
          </section>
          {activeId ? (
            <>
              {selectedId && <Button size="xs" variant="secondary" className="ap-back" onClick={() => update({ application: '' })}>← All applicants</Button>}
              <ApplicantDetail key={activeId} applicationId={activeId} centre={centre}
                onChanged={(updated) => {
                  setData((current) => current?.map((item) => (item.id === updated.id ? { ...item, status: updated.status, is_unseen: false } : item)));
                  reload({ silent: true });
                }} />
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
