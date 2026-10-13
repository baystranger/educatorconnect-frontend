import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, ErrorState, Icon, PageLoader, Pill } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { getCentreDashboard } from '../../services/centreApi.js';
import { formatDateTime, formatShortDate, formatTime, greeting, monthDay, plural, STATUS_TONES } from '../../utils/format.js';
import './centre.css';

const BADGE_TONES = { 'New applicant': 'purple', Practicum: 'green', Tour: 'yellow', Unanswered: 'danger', Waitlist: 'gray' };

export default function CentreDashboardPage() {
  useDocumentTitle('Centre dashboard');
  const { user } = useAuth();
  const { data, loading, error, reload } = useResource((signal) => getCentreDashboard({ signal }), []);
  const [group, setGroup] = useState('all');

  if (loading && !data) return <PageLoader label="Loading your dashboard…" />;
  if (error && !data) return <main className="ec-main"><div className="ec-container"><ErrorState error={error} onRetry={reload} /></div></main>;

  const { stats, profile, attention } = data;
  const items = attention.items.filter((item) => group === 'all' || item.group === group).slice(0, 5);
  const maxViews = Math.max(1, ...data.views_weekly.map((week) => week.views));
  const shortName = user?.short_name || data.name;
  const profileLive = profile.is_published && profile.status === 'published';

  return (
    <main className="ec-main">
      <div className="ec-container ec-stack">
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">{greeting()}, {shortName}</h1>
            <p className="ec-sub">{data.waiting_count ? <>You have <strong style={{ color: '#17121F' }}>{plural(data.waiting_count, 'thing')}</strong> waiting for you today.</> : 'You’re all caught up.'}</p>
          </div>
          <div className="ec-actions">
            <Button variant="secondary" to={profileLive ? `/childcare/${data.slug}` : '/centre/profile/review'}>{profileLive ? 'View public profile' : 'Finish your profile'}</Button>
            <Button to="/centre/jobs/new"><Icon name="plus" size={16} strokeWidth={2.6} />Post a job</Button>
          </div>
        </div>

        {!user?.email_verified && (
          <div className="ec-alert ec-alert-warning">Verify your email to publish jobs and your profile — we sent a link to <strong>{user?.email}</strong>. <Link to="/settings">Resend or change it</Link></div>
        )}

        <section className="ec-card cd-profile">
          <span className="cd-profile-art" aria-hidden="true"><span /><span /></span>
          <div className="cd-profile-copy">
            <div>
              <strong>{profileLive ? 'Your centre profile is live' : profile.status === 'pending_review' ? 'Your profile is in review' : 'Your centre profile is a draft'}</strong>
              <Pill size="sm" tone={profileLive ? 'green' : 'yellow'}>{profileLive ? `Published${profile.is_verified ? ' · Verified' : ''}` : profile.status === 'pending_review' ? 'In review' : 'Draft'}</Pill>
            </div>
            <span>{profile.percent}% complete{profile.recommendation ? ` — ${profile.recommendation} to rank higher in parent searches.` : '.'}</span>
          </div>
          <span className="cd-progress" aria-label={`Profile ${profile.percent}% complete`}><span style={{ width: `${profile.percent}%` }} /></span>
          <Button variant="soft" to="/centre/profile/basics">{profileLive ? 'Improve profile' : 'Continue profile'}</Button>
        </section>

        <div className="ec-stats">
          <Link className="ec-stat ec-card-link" to="/centre/jobs"><span className="ec-stat-label">Open positions</span><span className="ec-stat-value"><span className="ec-stat-number">{stats.open_positions}</span>{stats.drafts > 0 && <span className="ec-stat-note">{plural(stats.drafts, 'draft')}</span>}</span></Link>
          <Link className="ec-stat ec-card-link" to="/centre/applicants"><span className="ec-stat-label">New applicants</span><span className="ec-stat-value"><span className="ec-stat-number">{stats.new_applicants}</span>{stats.new_applicants_this_week > 0 && <span className="ec-stat-note" style={{ color: '#016516', fontWeight: 600 }}>+{stats.new_applicants_this_week} this week</span>}</span></Link>
          <Link className="ec-stat ec-card-link" to="/centre/families"><span className="ec-stat-label">Enrolment inquiries</span><span className="ec-stat-value"><span className="ec-stat-number">{stats.inquiries}</span>{stats.unanswered_inquiries > 0 && <span className="ec-stat-note" style={{ color: '#B42318', fontWeight: 600 }}>{stats.unanswered_inquiries} unanswered</span>}</span></Link>
          <div className="ec-stat"><span className="ec-stat-label">Profile views (30 days)</span><span className="ec-stat-value"><span className="ec-stat-number">{stats.profile_views_30d}</span>{stats.profile_views_change !== null && <span className="ec-stat-note" style={{ color: stats.profile_views_change >= 0 ? '#016516' : '#B42318', fontWeight: 600 }}>{stats.profile_views_change >= 0 ? '+' : ''}{stats.profile_views_change}%</span>}</span></div>
        </div>

        <div className="cd-columns">
          <div className="ec-stack">
            <section className="ec-card" style={{ overflow: 'hidden' }}>
              <div className="ec-card-head">
                <h2 className="ec-h2">Needs your attention</h2>
                <div className="ec-segment" role="group" aria-label="Filter">
                  {[['all', 'All'], ['hiring', 'Hiring'], ['families', 'Families']].map(([key, label]) => (
                    <button key={key} type="button" aria-pressed={group === key ? 'true' : 'false'} onClick={() => setGroup(key)}>{label} · {attention.counts[key]}</button>
                  ))}
                </div>
              </div>
              {items.length === 0 ? (
                <div className="ec-state ec-divider-top"><strong>Nothing waiting</strong><span>New applicants, tour requests and parent questions appear here.</span></div>
              ) : items.map((item) => (
                <Link key={`${item.kind}-${item.href}`} to={item.href} className="ec-row cd-attention-row">
                  <Avatar initials={item.initials} name={item.title} />
                  <span className="cd-attention-copy"><strong>{item.title}</strong><small>{[item.when && formatDateTime(item.when), item.subtitle].filter(Boolean).join(' · ')}</small></span>
                  <Pill tone={BADGE_TONES[item.badge] || 'gray'}>{item.badge}</Pill>
                  <span className="cd-action">{item.action} →</span>
                </Link>
              ))}
            </section>

            <section className="ec-card" style={{ overflow: 'hidden' }}>
              <div className="ec-card-head"><h2 className="ec-h2">Job postings</h2><Link to="/centre/jobs" style={{ fontWeight: 700, fontSize: 14.5 }}>Manage all</Link></div>
              {data.jobs.length === 0 ? (
                <div className="ec-state ec-divider-top"><strong>No postings yet</strong><span>Post your first role to start receiving applicants.</span><Button size="sm" to="/centre/jobs/new">Post a job</Button></div>
              ) : (
                <>
                  <div className="ec-table-head cd-jobs-head"><span>Role</span><span>Status</span><span>Applicants</span><span>Views</span><span>Closes</span></div>
                  {data.jobs.map((job) => (
                    <Link key={job.id} to={job.status === 'draft' ? `/centre/jobs/${job.id}/edit` : `/centre/applicants?job=${job.id}`} className="ec-row cd-jobs-row">
                      <span className="cd-role"><strong>{job.title}</strong><small>{[job.employment_type?.label, job.number_of_positions && plural(job.number_of_positions, job.employment_type?.key === 'practicum' ? 'placement' : 'position')].filter(Boolean).join(' · ')}</small></span>
                      <Pill size="sm" tone={STATUS_TONES[job.status]}>{job.status === 'published' ? 'Published' : 'Draft'}</Pill>
                      <span className="cd-cell"><strong>{job.status === 'draft' ? '—' : job.applicants_count}</strong>{job.new_applicants_count > 0 && <span className="cd-new"> +{job.new_applicants_count} new</span>}</span>
                      <span className="cd-cell">{job.status === 'draft' ? '—' : job.views}</span>
                      <span className="cd-cell">{job.application_deadline ? formatShortDate(job.application_deadline) : 'Not set'}</span>
                    </Link>
                  ))}
                </>
              )}
            </section>
          </div>

          <aside className="cd-side">
            <section className="cd-panel">
              <div className="cd-panel-head"><strong>This week</strong><span>Tours &amp; interviews</span></div>
              {data.this_week.length === 0 && <span className="ec-muted" style={{ fontSize: 14 }}>No tours or interviews in the next 7 days.</span>}
              {data.this_week.map((event) => {
                const day = monthDay(event.at);
                return (
                  <Link key={`${event.kind}-${event.at}-${event.title}`} to={event.href} className="cd-event">
                    <span className="cd-cal"><span>{day.weekday}</span><span>{day.day}</span></span>
                    <span className="cd-event-copy"><strong>{event.title}</strong><small>{formatTime(event.at)} · {event.subtitle}</small></span>
                    <Pill size="sm" tone={event.kind === 'tour' ? 'yellow' : 'purple'}>{event.kind === 'tour' ? 'Tour' : 'Interview'}</Pill>
                  </Link>
                );
              })}
            </section>

            <section className="cd-panel">
              <div className="cd-panel-head"><strong>Profile views</strong><span>Last 8 weeks</span></div>
              <div className="cd-chart" role="img" aria-label={`Weekly profile views: ${data.views_weekly.map((w) => w.views).join(', ')}`}>
                {data.views_weekly.map((week, index) => (
                  <span key={week.week_start} className={index === data.views_weekly.length - 1 ? 'is-current' : ''} style={{ height: `${Math.max(4, (week.views / maxViews) * 100)}%` }} title={`Week of ${formatShortDate(week.week_start)}: ${week.views} views`} />
                ))}
              </div>
              <span className="cd-chart-note">{stats.profile_views_30d ? `${stats.profile_views_30d} families viewed your profile in the last 30 days.` : 'Add photos and a welcome video to help families find you.'}</span>
            </section>

            <section className="cd-promo">
              <span>PROFESSIONAL DIRECTORY</span>
              <strong>Need a licensing consultant, speech therapist or bookkeeper?</strong>
              <Link to="/#directory">Find trusted services</Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
