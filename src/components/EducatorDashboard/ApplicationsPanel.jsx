function ApplicationProgress({ status, step }) {
  const stages = ['New', 'Reviewed', 'Shortlisted', 'Interview', 'Offered'];

  return (
    <div
      className="application-progress"
      role="img"
      aria-label={`Application stage: ${status}, ${step} of ${stages.length}`}
    >
      {stages.map((stage, index) => (
        <span
          className={`application-progress-step${index < step ? ' is-complete' : ''}`}
          key={stage}
        />
      ))}
    </div>
  );
}

export default function ApplicationsPanel({ applications }) {
  return (
    <section className="dashboard-panel applications-panel" id="applications" aria-labelledby="applications-heading">
      <div className="dashboard-panel-heading">
        <h2 id="applications-heading">Your applications</h2>
        <a href="#applications">View all</a>
      </div>

      <ul className="applications-list">
        {applications.map((application) => (
          <li className="application-row" key={application.title}>
            <span
              className="application-avatar"
              style={{ backgroundColor: application.avatarBackground, color: application.avatarColor }}
              aria-hidden="true"
            >
              {application.initials}
            </span>
            <span className="application-copy">
              <strong>{application.title}</strong>
              <span>{application.centre} · Applied {application.date}</span>
            </span>
            <ApplicationProgress status={application.status} step={application.step} />
            <span className={`application-status status-${application.status.toLowerCase().replace(' ', '-')}`}>
              {application.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
