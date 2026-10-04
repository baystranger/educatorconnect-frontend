import { useState } from 'react';
import Icon from './Icon.jsx';

const links = [
  ['Find Childcare', '#care'],
  ['Jobs', '#jobs'],
  ['For Centres', '#centres'],
  ['Directory', '#directory'],
  ['Resources', '#footer'],
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
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="sign-in" href="#signin">Sign in</a>
          <a className="button button-small" href="#signup">Get started</a>
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
    </header>
  );
}
