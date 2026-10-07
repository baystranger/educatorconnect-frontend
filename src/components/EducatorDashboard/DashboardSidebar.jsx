import DashboardIcon from './DashboardIcon.jsx';
import {
  dashboardData,
  practicumPlacementCount,
} from './dashboardData.js';

function NextUpCard({ onPreviewAction }) {
  return (
    <section className="next-up-card" aria-labelledby="next-up-heading">
      <p className="next-up-eyebrow">Next up</p>
      <div className="next-up-details">
        <div className="next-up-date" aria-label="October 8">
          <span>Oct</span>
          <strong>8</strong>
        </div>
        <div>
          <h2 id="next-up-heading">Interview · Little Sprouts</h2>
          <p>Thursday, 10:00 AM · In person</p>
        </div>
      </div>
      <div className="next-up-actions">
        <button
          type="button"
          onClick={() =>
            onPreviewAction('Interview details are not connected in this local preview.')
          }
        >
          View details
        </button>
        <button
          type="button"
          onClick={() =>
            onPreviewAction('Calendar integration is not connected in this local preview.')
          }
        >
          Add to calendar
        </button>
      </div>
    </section>
  );
}

function PracticumCard({ enabled, onChange, onPreviewAction }) {
  return (
    <section className="dashboard-panel practicum-card" aria-labelledby="practicum-heading">
      <div className="practicum-copy">
        <h2 id="practicum-heading">Practicum mode</h2>
        <p>
          {enabled
            ? 'On — practicum placements show in your search.'
            : 'Turn on if you’re an ECE student looking for placements.'}
        </p>
      </div>
      <button
        className={`practicum-switch${enabled ? ' is-on' : ''}`}
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Practicum mode"
        onClick={onChange}
      >
        <span />
      </button>
      {enabled && (
        <button
          className="practicum-placement-link"
          type="button"
          onClick={() =>
            onPreviewAction(
              `${practicumPlacementCount} nearby practicum placements are sample data in this preview.`,
            )
          }
        >
          {practicumPlacementCount} practicum placements near you
          <span aria-hidden="true">→</span>
        </button>
      )}
    </section>
  );
}

function RecentActivity() {
  return (
    <section className="dashboard-panel activity-card" aria-labelledby="activity-heading">
      <div className="compact-panel-heading">
        <h2 id="activity-heading">Recent activity</h2>
        <a href="#applications">All</a>
      </div>
      <ol className="activity-list">
        {dashboardData.activity.map((item) => (
          <li className="activity-item" key={`${item.message}-${item.when}`}>
            <span className="activity-dot" style={{ backgroundColor: item.color }} aria-hidden="true" />
            <span>
              <span>{item.message}</span>
              <span>{item.when}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function QuickLinks({ onPreviewAction }) {
  return (
    <section className="dashboard-panel quick-links-card" aria-labelledby="quick-links-heading">
      <h2 id="quick-links-heading">Quick links</h2>
      <ul>
        {dashboardData.quickLinks.map((link) => (
          <li key={link}>
            <button
              type="button"
              onClick={() =>
                onPreviewAction(`${link} is not connected in this local preview.`)
              }
            >
              <span>{link}</span>
              <DashboardIcon name="chevron-right" size={15} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DashboardSidebar({
  practicumMode,
  onPracticumModeChange,
  onPreviewAction,
}) {
  return (
    <aside className="dashboard-sidebar" aria-label="Your dashboard updates">
      <NextUpCard onPreviewAction={onPreviewAction} />
      <PracticumCard
        enabled={practicumMode}
        onChange={onPracticumModeChange}
        onPreviewAction={onPreviewAction}
      />
      <RecentActivity />
      <QuickLinks onPreviewAction={onPreviewAction} />
    </aside>
  );
}
