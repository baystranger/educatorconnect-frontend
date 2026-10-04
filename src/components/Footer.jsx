import { footerColumns } from '../data.js';
import Icon from './Icon.jsx';

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="brand brand-footer" href="#top" aria-label="Educator Connect home">
            <img src="/educator-connect-logo.png" alt="Educator Connect" />
          </a>
          <p>One trusted place for childcare discovery, educator careers and early childhood professional services.</p>
        </div>
        <div className="footer-columns">
          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) => <a href="#directory" key={link}>{link}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Educator Connect</span>
        <div><a href="#footer">Terms &amp; Conditions</a><a href="#footer">Privacy Policy</a><a href="#footer">Accessibility</a><a href="#footer">Contact</a></div>
      </div>
    </footer>
  );
}
