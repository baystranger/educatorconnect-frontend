import { useState } from 'react';
import Icon from './Icon.jsx';

const links = [
  ['Find Childcare', '/childcare-search', 'Search & compare centres'],
  ['Jobs', '#jobs', 'Roles & practicum placements'],
  ['For Centres', '#centres', 'Post jobs & showcase your centre'],
  ['Directory', '#directory', 'Services for centres · claim a profile'],
  ['Resources', '#footer', 'Guides, articles & help'],
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="Educator Connect home">
          <img src="/educator-connect-logo.png" alt="Educator Connect" />
        </a>
        <nav className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a
              className={href === '/childcare-search' && window.location.pathname === href ? 'active' : undefined}
              href={href}
              key={href}
              onClick={() => setMenuOpen(false)}
            >{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="sign-in" href="/signin">Sign in</a>
          <a className="button button-small" href="/signup">Get started</a>
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
        <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-sheet" role="dialog" aria-label="Menu" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-menu-heading">
              <img src="/educator-connect-logo.png" alt="Educator Connect" />
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button>
            </div>
            <nav aria-label="Primary">
              {links.map(([label, href, description]) => (
                <a href={href} key={href} onClick={() => setMenuOpen(false)}>
                  <span><strong>{label}</strong><small>{description}</small></span>
                  <Icon name="arrow" size={17} />
                </a>
              ))}
            </nav>
            <div className="mobile-menu-actions">
              <a href="/signup" onClick={() => setMenuOpen(false)}>Get started</a>
              <a href="/signin" onClick={() => setMenuOpen(false)}>Sign in</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
