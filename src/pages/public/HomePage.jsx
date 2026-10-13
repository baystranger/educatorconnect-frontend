import { Link } from 'react-router-dom';
import AudienceSection from '../../components/AudienceSection.jsx';
import CentresSection from '../../components/CentresSection.jsx';
import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';
import Hero from '../../components/Hero.jsx';
import JobsSection from '../../components/JobsSection.jsx';
import ProfessionalsSection from '../../components/ProfessionalsSection.jsx';
import TrustSection from '../../components/TrustSection.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function HomePage() {
  useDocumentTitle('Educator Connect — Home');

  return (
    <>
      <Header />
      <main className="w-full">
        <Hero />
        <AudienceSection />
        <JobsSection />
        <CentresSection />
        <ProfessionalsSection />
        <TrustSection />
        <section className="final-cta-section">
          <div className="final-cta">
            <div className="cta-orbit cta-orbit-one" />
            <div className="cta-orbit cta-orbit-two" />
            <h2>
              Join the community <span>today.</span>
            </h2>
            <p>Free for educators and centres. Parents never need an account.</p>
            <div className="cta-actions">
              <Link className="button" to="/signup?type=educator">I’m an educator</Link>
              <Link className="button cta-centre" to="/signup?type=centre">I run a centre</Link>
              <Link className="cta-professional" to="/#directory">I’m a professional</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
