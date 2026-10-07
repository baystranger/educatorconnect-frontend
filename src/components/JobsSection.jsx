import { jobFilters, jobs } from '../data.js';
import Icon from './Icon.jsx';

export default function JobsSection({ filter, onFilterChange }) {
  const visibleJobs = jobs.filter((job) => filter === 'all' || job.typeKey === filter);
  const displayedJobs = visibleJobs.slice(0, 4);

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
                onClick={() => onFilterChange(id)}
              >{label}</button>
            ))}
          </div>
          <aside className="hiring-card">
            <span className="eyebrow">Hiring?</span>
            <strong>Reach qualified educators near your centre.</strong>
            <p className="hiring-description-desktop">Post full-time, part-time, casual, substitute or practicum roles and review applicants from your dashboard.</p>
            <p className="hiring-description-mobile">Post any role type and review applicants from your dashboard.</p>
            <a href="/signup?type=centre">Post a job <span aria-hidden="true">→</span></a>
          </aside>
        </div>
        <div className="job-list-panel">
          <div className="list-heading">
            <span><strong>{displayedJobs.length} {displayedJobs.length === 1 ? 'role' : 'roles'}</strong> near Vancouver, BC · within 25 km</span>
            <a href="#jobs">Browse all jobs <span aria-hidden="true">→</span></a>
          </div>
          {displayedJobs.length ? displayedJobs.map((job) => (
            <a className="job-row" href="#jobs" key={`${job.title}-${job.centre}`}>
              <span className={`avatar avatar-${job.tone}`}>{job.initials}</span>
              <span className="job-main"><strong>{job.title}</strong><span>{job.centre} · <span className="job-city">{job.city} · </span>{job.distance}</span></span>
              <span className="job-tags"><strong className={`job-tag tag-${job.tone}`}>{job.type}</strong><strong>{job.extra}</strong></span>
              <span className="job-posted">{job.posted}<Icon name="arrow" size={16} /></span>
            </a>
          )) : <p className="empty-state">No roles of this type nearby yet — try a wider radius.</p>}
        </div>
      </div>
    </section>
  );
}
