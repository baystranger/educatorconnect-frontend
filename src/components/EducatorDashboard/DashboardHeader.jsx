import { useState } from 'react';
import DashboardIcon from './DashboardIcon.jsx';

const navigationItems = [
  { label: 'Dashboard', href: '#dashboard', current: true },
  { label: 'Find jobs', href: '#recommended-jobs' },
  { label: 'My jobs', href: '#applications' },
  { label: 'Profile', href: '#profile-setup' },
];

function EducatorLogo() {
  return (
    <a className="dashboard-brand" href="#dashboard" aria-label="Educator Connect dashboard">
      <svg className="dashboard-brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="17" fill="none" stroke="#08752c" strokeWidth="2.5" />
        <path
          d="M26.5 13.5a10 10 0 1 0 1.1 13.1M12.3 19.7h13.8"
          fill="none"
          stroke="#4b147a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M8 10.2 12 7.7" fill="none" stroke="#e5a323" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="dashboard-brand-words">
        <span>EDUCATOR</span>
        <span>CONNECT</span>
      </span>
    </a>
  );
}

export default function DashboardHeader({ user, onLogout, loggingOut, onPreviewAction }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavigation() {
    setMenuOpen(false);
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-inner">
        <EducatorLogo />

        <button
          className="dashboard-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="educator-dashboard-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <DashboardIcon name={menuOpen ? 'close' : 'menu'} size={20} />
        </button>

        <nav
          className={`dashboard-navigation${menuOpen ? ' is-open' : ''}`}
          id="educator-dashboard-navigation"
          aria-label="Account"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              onClick={handleNavigation}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="dashboard-account-actions">
          <button
            className="dashboard-notification-button"
            type="button"
            aria-label="Notifications"
            onClick={() =>
              onPreviewAction('Notifications in this dashboard are sample data.')
            }
          >
            <DashboardIcon name="bell" size={20} />
            <span className="dashboard-notification-dot" aria-hidden="true" />
          </button>
          <button
            className="dashboard-account-button"
            type="button"
            aria-label={`Sign out${user?.name ? ` ${user.name}` : ''}`}
            onClick={onLogout}
            disabled={loggingOut}
          >
            <span className="dashboard-account-avatar" aria-hidden="true">
              {(user?.name || 'Educator')
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join('')
                .toUpperCase()}
            </span>
            <span>{loggingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
