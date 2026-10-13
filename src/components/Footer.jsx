import { Link } from 'react-router-dom';
import { footerColumns, mobileFooterColumns } from '../data.js';

function FooterLink({ link }) {
  return <Link to={link.href}>{link.label}</Link>;
}

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand brand-footer" to="/" aria-label="Educator Connect home">
            <img src="/educator-connect-logo.png" alt="Educator Connect" />
          </Link>
          <p>One trusted place for childcare, educator careers and early childhood services.</p>
        </div>
        <div className="footer-columns">
          {footerColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) => <FooterLink link={link} key={link.label} />)}
            </div>
          ))}
        </div>
        <div className="footer-mobile-columns">
          {mobileFooterColumns.map((column) => (
            <div className="footer-column" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) => <FooterLink link={link} key={link.label} />)}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copyright-desktop">© {new Date().getFullYear()} Educator Connect</span>
        <div><Link to="/#footer">Terms &amp; Conditions</Link><Link to="/#footer">Privacy Policy</Link><Link to="/#footer">Accessibility</Link><Link to="/#footer">Contact</Link></div>
        <div className="footer-mobile-legal"><Link to="/#footer">Terms</Link><Link to="/#footer">Privacy</Link><Link to="/#footer">Accessibility</Link><Link to="/#footer">Contact</Link></div>
        <span className="footer-copyright-mobile">© Educator Connect</span>
      </div>
    </footer>
  );
}
