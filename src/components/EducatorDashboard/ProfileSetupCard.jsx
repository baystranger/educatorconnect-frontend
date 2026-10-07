import DashboardIcon from './DashboardIcon.jsx';

export default function ProfileSetupCard({ items, onDismiss, onPreviewAction }) {
  return (
    <section className="dashboard-panel profile-setup-card" id="profile-setup" aria-label="Profile completion">
      <div className="profile-completion-summary">
        <div
          className="profile-completion-ring"
          role="img"
          aria-label="Profile is 70 percent complete"
        >
          <span>70%</span>
        </div>
        <div>
          <h2>Finish your profile</h2>
          <p>Complete profiles get noticed first.</p>
        </div>
      </div>

      <div className="profile-setup-items">
        {items.map((item) => (
          <button
            className="profile-setup-item"
            key={item.title}
            type="button"
            onClick={() =>
              onPreviewAction(`${item.title} is not connected in this local preview.`)
            }
          >
            <span className="profile-setup-item-indicator" aria-hidden="true" />
            <span className="profile-setup-item-copy">
              <span>{item.title}</span>
              <small>{item.description}</small>
            </span>
          </button>
        ))}
      </div>

      <button
        className="profile-setup-dismiss"
        type="button"
        aria-label="Hide profile setup reminders"
        onClick={onDismiss}
      >
        <DashboardIcon name="close" size={18} />
      </button>
    </section>
  );
}
