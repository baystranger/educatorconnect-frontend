const nextSteps = {
  educator: [
    'Create your account',
    'Verify your email',
    'Build your profile & intro video',
    'Search nearby jobs and apply',
  ],
  centre: [
    'Create your account',
    'Verify your email',
    'Build your centre profile',
    'Post a job & welcome families',
  ],
};

export default function SignupSidebar({ accountType, step }) {
  const isDetails = step !== 'account-type';
  const type = accountType || 'educator';
  const steps = nextSteps[type];

  return (
    <aside className={`signup-sidebar signup-sidebar-${isDetails ? type : 'welcome'}`}>
      <div className="signup-side-orbit signup-side-orbit-one" />
      <div className="signup-side-orbit signup-side-orbit-two" />
      <span className="signup-free-pill"><i />Free for educators &amp; centres</span>
      {!isDetails ? (
        <div className="signup-preview-stack" aria-label="Educator Connect account previews">
          <div className="signup-job-preview">
            <span className="signup-preview-avatar">LS</span>
            <span className="signup-preview-copy"><strong>Early Childhood Educator</strong><small>Little Sprouts Daycare · 2.4 km</small></span>
            <span className="signup-preview-pills"><i>Full-time</i><i>Applied · Shortlisted</i></span>
          </div>
          <div className="signup-centre-preview">
            <span className="signup-centre-art"><i /><i /><b>▶ Welcome video</b></span>
            <span><strong>Cedar &amp; Moss Nature School</strong><small>3 new inquiries · 1 tour request</small></span>
          </div>
        </div>
      ) : (
        <div className={`signup-profile-preview signup-profile-${type}`}>
          {type === 'educator' ? (
            <>
              <span className="signup-preview-eyebrow">YOUR EDUCATOR PROFILE — PREVIEW</span>
              <div className="signup-profile-card">
                <div className="signup-video-preview"><i>▶</i><span>Intro video · 30–60s</span></div>
                <div className="signup-profile-details">
                  <span className="signup-profile-avatar">You</span>
                  <strong>Your name</strong>
                  <small>Early Childhood Educator · Your city</small>
                  <div className="signup-profile-tags"><i>Certifications</i><i>Age groups</i><i>Teaching philosophy</i></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="signup-preview-eyebrow">YOUR CENTRE PROFILE — PREVIEW</span>
              <div className="signup-profile-card signup-centre-profile-card">
                <div className="signup-centre-video"><span>▶ Welcome video</span></div>
                <div className="signup-profile-details">
                  <strong>Your centre name</strong>
                  <small>Childcare centre · Your city</small>
                  <div className="signup-profile-tags"><i>Programs</i><i>Gallery</i><i>Availability</i></div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <div className="signup-side-copy">
        <h2>Where early childhood comes together.</h2>
        <p>Free for educators and childcare centres across Canada.</p>
      </div>
      {isDetails && (
        <div className="signup-next-steps">
          <span className="signup-preview-eyebrow">WHAT HAPPENS NEXT</span>
          {steps.map((label, index) => (
            <div className="signup-next-step" key={label}>
              <span className="bg-white">{index + 1}</span><strong>{label}</strong>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
