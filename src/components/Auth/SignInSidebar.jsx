const activityCards = [
  { initials: 'LS', label: 'EDUCATORS', title: 'Application moved to Interview', tag: 'Shortlisted', className: 'purple' },
  { initials: 'HH', label: 'CENTRES', title: 'New tour request from a family', tag: 'Inquiry', className: 'gold' },
  { initials: 'MC', label: 'PROFESSIONALS', title: 'Your profile claim was approved', tag: 'Claimed', className: 'mint' },
];

export default function SignInSidebar() {
  return (
    <aside className="signin-sidebar" aria-label="Educator Connect community activity">
      <svg className="signin-sidebar-art" viewBox="0 0 624 868" aria-hidden="true">
        <path d="M0 520 624 430M200 0l100 868M0 700c200-40 420-60 624-100M430 0c20 160 90 260 194 260" />
        <circle cx="300" cy="470" r="210" />
        <circle className="signin-art-dot" cx="300" cy="470" r="9" />
        <circle className="signin-art-halo" cx="300" cy="470" r="22" />
      </svg>
      <div className="signin-sidebar-heading">
        <span>PICK UP WHERE YOU LEFT OFF</span>
        <h2>Your early childhood network, in one place.</h2>
      </div>
      <div className="signin-activity-cards">
        {activityCards.map((card) => (
          <div className={`signin-activity-card signin-card-${card.className}`} key={card.label}>
            <span className="signin-card-initials">{card.initials}</span>
            <span className="signin-card-copy">
              <span>{card.label}</span>
              <strong>{card.title}</strong>
            </span>
            <span className="signin-card-tag">{card.tag}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
