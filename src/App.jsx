import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import AudienceSection from './components/AudienceSection.jsx';
import JobsSection from './components/JobsSection.jsx';
import CentresSection from './components/CentresSection.jsx';
import ProfessionalsSection from './components/ProfessionalsSection.jsx';
import TrustSection from './components/TrustSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [jobFilter, setJobFilter] = useState('all');
  const [professionalFilter, setProfessionalFilter] = useState('all');

  return (
    <>
      <Header />
      <main className="w-full">
        <Hero />
        <AudienceSection />
        <JobsSection filter={jobFilter} onFilterChange={setJobFilter} />
        <CentresSection />
        <ProfessionalsSection
          filter={professionalFilter}
          onFilterChange={setProfessionalFilter}
        />
        <TrustSection />
        <section className="final-cta-section">
          <div className="final-cta" id="signup">
            <div className="cta-orbit cta-orbit-one" />
            <div className="cta-orbit cta-orbit-two" />
            <h2>
              Join the community <span>today.</span>
            </h2>
            <p>Free for educators and centres. Parents never need an account.</p>
            <div className="cta-actions">
              <a className="button" href="#signup">I’m an educator</a>
              <a className="button cta-centre" href="#signup">I run a centre</a>
              <a className="cta-professional" href="#directory">I’m a professional</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
