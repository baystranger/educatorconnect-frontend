import DashboardIcon from './DashboardIcon.jsx';

export default function RecommendedJobs({
  jobs,
  savedJobs,
  onToggleSaved,
  onPreviewAction,
}) {
  return (
    <section className="recommended-jobs-section" id="recommended-jobs" aria-labelledby="recommended-jobs-heading">
      <div className="recommended-jobs-heading">
        <div className="recommended-jobs-title">
          <h2 id="recommended-jobs-heading">Recommended for you</h2>
          <span>Within 25 km of V5K · Full-time, Part-time</span>
        </div>
        <a href="#recommended-jobs">See all jobs</a>
      </div>

      <div className="recommended-jobs-grid">
        {jobs.map((job) => {
          const isSaved = Boolean(savedJobs[job.id]);

          return (
            <article className="dashboard-panel recommended-job-card" key={job.id}>
              <div className="recommended-job-topline">
                <span
                  className="recommended-job-avatar"
                  style={{ backgroundColor: job.avatarBackground, color: job.avatarColor }}
                  aria-hidden="true"
                >
                  {job.initials}
                </span>
                <button
                  className={`save-job-button${isSaved ? ' is-saved' : ''}`}
                  type="button"
                  aria-label={`${isSaved ? 'Remove' : 'Save'} ${job.title} at ${job.centre}`}
                  aria-pressed={isSaved}
                  onClick={() => onToggleSaved(job.id)}
                >
                  <DashboardIcon name="bookmark" size={17} filled={isSaved} />
                </button>
              </div>

              <h3>{job.title}</h3>
              <p className="recommended-job-meta">{job.centre} · {job.distance}</p>

              <div className="recommended-job-tags">
                <span>{job.schedule}</span>
                <span>{job.detail}</span>
              </div>

              <button
                className="recommended-job-action"
                type="button"
                onClick={() =>
                  onPreviewAction(
                    `Applications for ${job.title} are not connected in this local preview.`,
                  )
                }
              >
                View &amp; apply
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
