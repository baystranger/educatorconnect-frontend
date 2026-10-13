import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { homePathFor } from '../constants/roles.js';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from './Icon.jsx';

const links = [
  ['care', 'Find Childcare', '/childcare', 'Search & compare centres'],
  ['jobs', 'Jobs', '/jobs', 'Roles & practicum placements'],
  ['centres', 'For Centres', '/#centres', 'Post jobs & showcase your centre'],
  ['directory', 'Directory', '/#directory', 'Services for centres · claim a profile'],
  ['resources', 'Resources', '/#footer', 'Guides, articles & help'],
];

function activeKey(pathname) {
  if (pathname.startsWith('/childcare')) return 'care';
  if (pathname.startsWith('/jobs')) return 'jobs';
  return null;
}

/** Public top navigation (homepage + parent-facing pages). */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const current = activeKey(pathname);
  const close = () => setMenuOpen(false);

  const accountActions = user ? (
    <Link className="button button-small" to={homePathFor(user)} onClick={close}>Dashboard</Link>
  ) : (
    <>
      <Link className="sign-in" to="/signin" onClick={close}>Sign in</Link>
      <Link className="button button-small" to="/signup" onClick={close}>Get started</Link>
    </>
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Educator Connect home">
          <img src="/educator-connect-logo.png" alt="Educator Connect" />
        </Link>
        <nav className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Main navigation">
          {links.map(([key, label, href]) => (
            <Link
              className={current === key ? 'active' : undefined}
              aria-current={current === key ? 'page' : undefined}
              to={href}
              key={key}
              onClick={close}
            >{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          {accountActions}
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-menu-backdrop" onClick={close}>
          <div className="mobile-menu-sheet" role="dialog" aria-label="Menu" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-menu-heading">
              <img src="/educator-connect-logo.png" alt="Educator Connect" />
              <button type="button" aria-label="Close menu" onClick={close}>×</button>
            </div>
            <nav aria-label="Primary">
              {links.map(([key, label, href, description]) => (
                <Link to={href} key={key} onClick={close}>
                  <span><strong>{label}</strong><small>{description}</small></span>
                  <Icon name="arrow" size={17} />
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-actions">
              {user ? (
                <Link to={homePathFor(user)} onClick={close}>Go to dashboard</Link>
              ) : (
                <>
                  <Link to="/signup" onClick={close}>Get started</Link>
                  <Link to="/signin" onClick={close}>Sign in</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
