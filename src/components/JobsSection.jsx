import { useState } from 'react';
import { Link } from 'react-router-dom';
import { jobFilters } from '../data.js';
import { useResource } from '../hooks/useResource.js';
import { searchJobs } from '../services/publicApi.js';
import { km, timeAgo } from '../utils/format.js';
import Icon from './Icon.jsx';

const TAG_TONE = { practicum: 'gold', substitute: 'green', casual: 'green' };
const AVATAR_TONE = ['purple', 'gold', 'green', 'purple'];

function extraTag(job) {
  if (job.employment_type?.key === 'practicum') return job.practicum_level?.label ? `${job.practicum_level.label} intake` : 'Placement';
  if (job.number_of_positions > 1) return `${job.number_of_positions} positions`;
  return job.pay || job.category?.label;
}

export default function JobsSection() {
  const [filter, setFilter] = useState('all');
  const type = jobFilters.find(([id]) => id === filter)?.[2];
  const { data: jobs, meta, loading, error, reload } = useResource(
    (signal) => searchJobs({ employment_types: type, per_page: 5, sort: 'newest' }, { signal }),
    [type],
  );

  const total = meta?.total ?? 0;

  return (
    <section className="section jobs-section" id="jobs">
      <div className="jobs-layout">
        <div className="jobs-intro">
          <div className="jobs-heading">
            <span className="eyebrow">For educators &amp; ECE students</span>
            <h2>Your next role, <span>close to home.</span></h2>
            <p className="jobs-description-desktop">Search by postal code and radius, apply with your profile and intro video, and track every application in one place.</p>
            <p className="jobs-description-mobile">Search by postal code and radius, apply with your profile, and track every application.</p>
          </div>
          <div className="filter-row" aria-label="Filter jobs by role type">
            {jobFilters.map(([id, label]) => (
              <button
                className={filter === id ? 'filter-pill selected' : 'filter-pill'}
                type="button"
                key={id}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
              >{label}</button>
            ))}
          </div>
          <aside className="hiring-card">
            <span className="eyebrow">Hiring?</span>
            <strong>Reach qualified educators near your centre.</strong>
            <p className="hiring-description-desktop">Post full-time, part-time, casual, substitute or practicum roles and review applicants from your dashboard.</p>
            <p className="hiring-description-mobile">Post any role type and review applicants from your dashboard.</p>
            <Link to="/signup?type=centre">Post a job <span aria-hidden="true">→</span></Link>
          </aside>
        </div>
        <div className="job-list-panel" aria-busy={loading}>
          <div className="list-heading">
            <span><strong>{loading ? '…' : `${total} ${total === 1 ? 'role' : 'roles'}`}</strong> open now · newest first</span>
            <Link to={type ? `/jobs?employment_types=${type}` : '/jobs'}>Browse all jobs <span aria-hidden="true">→</span></Link>
          </div>
          {error && (
            <p className="empty-state">
              Jobs couldn’t load right now. <button type="button" className="ec-link-btn" onClick={() => reload()}>Try again</button>
            </p>
          )}
          {!error && loading && Array.from({ length: 4 }, (_, index) => (
            <div className="job-row" key={index} aria-hidden="true"><span className="ec-skeleton" style={{ height: 44, gridColumn: '1 / -1' }} /></div>
          ))}
          {!error && !loading && jobs?.length === 0 && <p className="empty-state">No roles of this type yet — check back soon or browse all jobs.</p>}
          {!error && !loading && jobs?.map((job, index) => {
            const tone = TAG_TONE[job.employment_type?.key] || 'purple';
            return (
              <Link className="job-row" to={`/jobs/${job.slug}`} key={job.id}>
                <span className={`avatar avatar-${AVATAR_TONE[index % AVATAR_TONE.length]}`}>{job.centre?.initials}</span>
                <span className="job-main">
                  <strong>{job.title}</strong>
                  <span>{job.centre?.name} · <span className="job-city">{job.city}</span>{job.distance_km !== null && ` · ${km(job.distance_km)}`}</span>
                </span>
                <span className="job-tags"><strong className={`job-tag tag-${tone}`}>{job.employment_type?.label}</strong>{extraTag(job) && <strong>{extraTag(job)}</strong>}</span>
                <span className="job-posted">{timeAgo(job.published_at)}<Icon name="arrow" size={16} /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
