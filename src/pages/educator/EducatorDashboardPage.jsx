import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, ErrorState, Icon, PageLoader, Pill, StepBars, Switch } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useLiveRefresh } from '../../hooks/useLiveRefresh.js';
import { useResource } from '../../hooks/useResource.js';
import { dismissProfileSetup, getEducatorDashboard, saveJob, setPracticumMode, unsaveJob } from '../../services/educatorApi.js';
import { icsDataUrl } from '../../utils/calendar.js';
import { formatDayDate, formatShortDate, formatWeekdayTime, greeting, km, monthDay, STATUS_TONES, timeAgo } from '../../utils/format.js';
import './educator-dashboard.css';

const DOT = { purple: '#42007B', green: '#016516', yellow: '#E6B300', gold: '#E6B300' };

function StatTile({ to, label, value, note, colour }) {
  return (
    <Link to={to} className="ec-stat ec-card-link">
      <span className="ec-stat-label">{label}</span>
      <span className="ec-stat-value"><span className="ec-stat-number" style={{ color: colour }}>{value}</span>{note && <span className="ec-stat-note">{note}</span>}</span>
    </Link>
  );
}

export default function EducatorDashboardPage() {
  useDocumentTitle('Educator dashboard');
  const { user, refresh } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload, setData } = useResource((signal) => getEducatorDashboard({ signal }), []);
  useLiveRefresh(reload);
  const [savingPracticum, setSavingPracticum] = useState(false);

  if (loading && !data) return <PageLoader label="Loading your dashboard…" />;
  if (error && !data) return <main className="ec-main"><div className="ec-container"><ErrorState error={error} onRetry={reload} /></div></main>;

  const { stats, completion, next_up: next } = data;
  const todos = completion.items.filter((item) => !item.done).slice(0, 3);
  const basis = data.recommendation_basis;
  const basisLabel = [basis.postal_prefix && `Within ${basis.radius_km} km of ${basis.postal_prefix}`, basis.employment_types.join(', ')].filter(Boolean).join(' · ');

  async function hideSetup() {
    setData((current) => ({ ...current, show_setup: false }));
    dismissProfileSetup().catch(() => {});
  }

  async function togglePracticum(enabled) {
    setSavingPracticum(true);
    setData((current) => ({ ...current, practicum: { ...current.practicum, enabled } }));
    try {
      await setPracticumMode(enabled);
      toast.success(enabled ? 'Practicum mode on — centres can see you’re looking for a placement.' : 'Practicum mode off.');
      refresh();
    } catch (requestError) {
      setData((current) => ({ ...current, practicum: { ...current.practicum, enabled: !enabled } }));
      toast.error(requestError);
    } finally {
      setSavingPracticum(false);
    }
  }

  async function toggleSaved(job) {
    const next = !job.is_saved;
    const patch = (value) => setData((current) => ({
      ...current,
      recommended: current.recommended.map((item) => (item.id === job.id ? { ...item, is_saved: value } : item)),
      stats: { ...current.stats, saved_jobs: current.stats.saved_jobs + (value ? 1 : -1) },
    }));
    patch(next);
    try {
      if (next) await saveJob(job.id); else await unsaveJob(job.id);
      toast.success(next ? 'Job saved.' : 'Removed from saved jobs.');
    } catch (requestError) {
      patch(!next);
      toast.error(requestError);
    }
  }

  const nextDate = next ? monthDay(next.at) : null;

  return (
    <main className="ec-main">
      <div className="ec-container ec-stack">
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">{greeting()}, {data.first_name || user?.short_name}</h1>
            <p className="ec-sub">Here’s where your job search stands today.</p>
          </div>
          <div className="ec-actions">
            <Button variant="secondary" to="/educator/profile">View my profile</Button>
            <Button to="/educator/jobs"><Icon name="search" size={17} strokeWidth={2.5} />Find jobs</Button>
          </div>
        </div>

        {!user?.email_verified && (
          <div className="ec-alert ec-alert-warning">Verify your email to apply for jobs — we sent a link to <strong>{user?.email}</strong>. <Link to="/settings">Resend or change it</Link></div>
        )}

        {data.show_setup && (
          <section className="ec-card ed-setup" aria-label="Profile completion">
            <div className="ed-ring-wrap">
              <div className="ed-ring" style={{ background: `conic-gradient(#016516 0 ${completion.percent}%, #E8F3EA ${completion.percent}% 100%)` }}><span>{completion.percent}%</span></div>
              <div className="ed-ring-copy"><strong>Finish your profile</strong><span>Complete profiles get noticed first.</span></div>
            </div>
            <div className="ed-todos">
              {todos.map((item) => (
                <Link key={item.key} to={`/educator/profile#${item.key}`} className="ed-todo ec-card-link">
                  <span className="ed-todo-dot" />
                  <span><strong>{item.todo}</strong>{item.hint && <small>{item.hint}</small>}</span>
                </Link>
              ))}
            </div>
            <button type="button" className="ed-dismiss" aria-label="Hide for now" onClick={hideSetup}>×</button>
          </section>
        )}

        <div className="ec-stats">
          <StatTile to="/educator/my-jobs" label="Active applications" value={stats.active_applications} note={stats.new_this_week ? `${stats.new_this_week} new this week` : null} />
          <StatTile to="/educator/my-jobs?filter=interviews" label="Interviews" value={stats.interviews} colour={stats.interviews ? '#42007B' : undefined} note={stats.next_interview_at ? formatDayDate(stats.next_interview_at) : null} />
          <StatTile to="/educator/my-jobs?tab=saved" label="Saved jobs" value={stats.saved_jobs} note={stats.closing_soon ? `${stats.closing_soon} closing soon` : null} />
          <StatTile to="/educator/profile" label="Profile views" value={stats.profile_views_30d} colour="#016516" note="last 30 days" />
        </div>

        <div className="ed-columns">
          <div className="ec-stack">
            <section className="ec-card" style={{ overflow: 'hidden' }}>
              <div className="ec-card-head">
                <h2 className="ec-h2">Your applications</h2>
                <Link to="/educator/my-jobs" style={{ fontWeight: 700, fontSize: 14.5 }}>View all</Link>
              </div>
              {data.applications.length === 0 ? (
                <div className="ec-state ec-divider-top">
                  <strong>No applications yet</strong>
                  <span>Find a role near you and apply with your profile in minutes.</span>
                  <Button size="sm" to="/educator/jobs">Find jobs</Button>
                </div>
              ) : data.applications.map((application) => (
                <Link key={application.id} to={`/educator/my-jobs?application=${application.id}`} className="ec-row ed-app-row">
                  <Avatar initials={application.job?.centre?.initials} name={application.job?.centre?.name} />
                  <span className="ed-app-title">
                    <strong>{application.job?.title}</strong>
                    <span>{application.job?.centre?.name} · Applied {formatShortDate(application.applied_at)}</span>
                  </span>
                  <StepBars step={application.is_closed ? 6 : application.step} total={5} closed={application.is_closed} />
                  <Pill tone={STATUS_TONES[application.status.key]}>{application.status.label}</Pill>
                </Link>
              ))}
            </section>

            <section className="ec-stack-sm">
              <div className="ed-recs-head">
                <div>
                  <h2 className="ec-h2">Recommended for you</h2>
                  {basisLabel && <span className="ed-basis">{basisLabel}</span>}
                </div>
                <Link to="/educator/jobs" style={{ fontWeight: 700, fontSize: 14.5 }}>See all jobs</Link>
              </div>
              {data.recommended.length === 0 ? (
                <div className="ec-card"><div className="ec-state">No new jobs right now — we’ll notify you when something matches.</div></div>
              ) : (
                <div className="ed-recs">
                  {data.recommended.map((job) => (
                    <article className="ed-rec" key={job.id}>
                      <div className="ed-rec-top">
                        <Avatar initials={job.centre?.initials} name={job.centre?.name} size={42} radius={12} src={job.centre?.logo_url} />
                        <button type="button" className="ed-save" aria-pressed={job.is_saved ? 'true' : 'false'} aria-label={job.is_saved ? 'Remove from saved jobs' : 'Save job'} onClick={() => toggleSaved(job)}>
                          <Icon name="bookmark" size={17} fill={job.is_saved ? '#42007B' : 'none'} />
                        </button>
                      </div>
                      <div className="ed-rec-title"><strong>{job.title}</strong><span>{[job.centre?.name, km(job.distance_km)].filter(Boolean).join(' · ')}</span></div>
                      <div className="ed-rec-tags">
                        <span className="ec-tag tone-purple">{job.employment_type?.label}</span>
                        {(job.pay || job.number_of_positions > 1) && <span className="ec-tag tone-gray">{job.pay || `${job.number_of_positions} positions`}</span>}
                      </div>
                      <Button variant="soft" to={`/educator/jobs?job=${job.slug}`}>View &amp; apply</Button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="ed-side">
            {next ? (
              <section className="ed-next">
                <span className="ed-next-label">NEXT UP</span>
                <div className="ed-next-row">
                  <span className="ed-cal"><span>{nextDate.month}</span><span>{nextDate.day}</span></span>
                  <div className="ed-next-copy">
                    <strong>Interview · {next.centre}</strong>
                    <span>{formatWeekdayTime(next.at)}{next.location ? ' · In person' : ''}</span>
                  </div>
                </div>
                <div className="ed-next-actions">
                  <Link to={`/educator/my-jobs?application=${next.application_id}`}>View details</Link>
                  <a href={icsDataUrl({ title: `Interview · ${next.centre}`, start: next.at, location: next.location || '', description: next.details || next.job_title })} download="interview.ics">Add to calendar</a>
                </div>
              </section>
            ) : (
              <section className="ed-next-empty">
                <strong>No interviews scheduled</strong>
                <span>When a centre invites you to interview, the details appear here.</span>
              </section>
            )}

            <section className="ed-panel">
              <div className="ed-practicum">
                <div>
                  <strong>Practicum mode</strong>
                  <span>{data.practicum.enabled ? 'On — practicum placements show in your search.' : 'Turn on if you’re an ECE student looking for placements.'}</span>
                </div>
                <Switch checked={data.practicum.enabled} onChange={togglePracticum} label="Practicum mode" disabled={savingPracticum} />
              </div>
              {data.practicum.enabled && <Link className="ed-practicum-link" to="/educator/jobs?practicum=1">See practicum placements near you →</Link>}
            </section>

            <section className="ed-panel" style={{ gap: 4 }}>
              <div className="ed-panel-head" style={{ marginBottom: 8 }}><strong>Recent activity</strong><Link to="/educator/my-jobs">All</Link></div>
              {data.activity.length === 0 && <span className="ec-muted" style={{ fontSize: 14 }}>Updates from centres will appear here.</span>}
              {data.activity.map((item) => (
                <Link key={item.id} className="ed-activity" to={item.href || '/educator/my-jobs'}>
                  <i style={{ background: DOT[item.tone] || '#CFC6D6' }} />
                  <span>{item.title}<small>{timeAgo(item.at)}</small></span>
                </Link>
              ))}
            </section>

            <section className="ed-panel" style={{ gap: 10 }}>
              <strong style={{ fontSize: 16 }}>Quick links</strong>
              {[
                ['Update employment preferences', '/educator/profile#preferences'],
                ['Upload a new résumé', '/educator/profile#resume'],
                ['Notification settings', '/settings?section=notifications'],
                ['Find childcare jobs near me', '/educator/jobs'],
              ].map(([label, to]) => (
                <Link key={label} to={to} className="ed-quick">{label}<Icon name="chevronRight" size={15} strokeWidth={2.4} style={{ color: '#42007B' }} /></Link>
              ))}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
