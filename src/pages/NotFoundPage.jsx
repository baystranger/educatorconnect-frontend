import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');

  return (
    <>
      <Header />
      <main className="ec-page-state" style={{ background: '#FCFBF8' }}>
        <div className="ec-state">
          <strong style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 34 }}>We couldn’t find that page</strong>
          <span>The link may be old, or the page may have moved.</span>
          <div className="ec-actions">
            <Link className="ec-btn ec-btn-primary" to="/">Go home</Link>
            <Link className="ec-btn ec-btn-secondary" to="/childcare">Find childcare</Link>
            <Link className="ec-btn ec-btn-secondary" to="/jobs">Browse jobs</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
