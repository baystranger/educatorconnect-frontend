import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import AudienceSection from './components/AudienceSection.jsx';
import JobsSection from './components/JobsSection.jsx';
import CentresSection from './components/CentresSection.jsx';
import ProfessionalsSection from './components/ProfessionalsSection.jsx';
import TrustSection from './components/TrustSection.jsx';
import Footer from './components/Footer.jsx';
import Signup from './components/Auth/Signup.jsx';
import SignIn from './components/Auth/SignIn.jsx';
import ChildcareSearch from './components/ChildcareSearch.jsx';
import OAuthCallback from './components/Auth/OAuthCallback.jsx';
import ResetPasswordPage from './components/Auth/ResetPasswordPage.jsx';
import CentreAccountPage from './pages/CentreAccountPage.jsx';
import EducatorDashboard from './pages/EducatorDashboard.jsx';

export default function App() {
  const [jobFilter, setJobFilter] = useState('all');
  const [professionalFilter, setProfessionalFilter] = useState('all');

  if (window.location.pathname.replace(/\/+$/, '') === '/signup') {
    return <Signup />;
  }

  if (window.location.pathname.replace(/\/+$/, '') === '/signin') {
    return <SignIn />;
  }

  if (window.location.pathname.replace(/\/+$/, '') === '/auth/callback') {
    return <OAuthCallback />;
  }

  if (window.location.pathname.replace(/\/+$/, '') === '/reset-password') {
    return <ResetPasswordPage />;
  }

  if (window.location.pathname.replace(/\/+$/, '') === '/centre/dashboard') {
    return <CentreAccountPage />;
  }

  if (window.location.pathname.replace(/\/+$/, '') === '/educator/dashboard') {
    return <EducatorDashboard />;
  }

  if (window.location.pathname.replace(/\/+$/, '') === '/childcare-search') {
    return <ChildcareSearch />;
  }

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
          <div className="final-cta">
            <div className="cta-orbit cta-orbit-one" />
            <div className="cta-orbit cta-orbit-two" />
            <h2>
              Join the community <span>today.</span>
            </h2>
            <p>Free for educators and centres. Parents never need an account.</p>
            <div className="cta-actions">
              <a className="button" href="/signup?type=educator">I’m an educator</a>
              <a className="button cta-centre" href="/signup?type=centre">I run a centre</a>
              <a className="cta-professional" href="/signup">I’m a professional</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
