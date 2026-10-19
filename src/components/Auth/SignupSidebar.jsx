const NEXT_STEPS = {
  educator: ['Create your account', 'Verify your email', 'Build your profile & intro video', 'Search nearby jobs and apply'],
  centre: ['Create your account', 'Verify your email', 'Build your centre profile', 'Post a job & welcome families'],
  professional: ['Create your account', 'Verify your email', 'Add or claim your directory listing', 'Get found by childcare centres'],
};

const CHIPS = { educator: 'Educator account', centre: 'Centre account', professional: 'Professional account' };

function PlayIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>;
}

function WelcomeCards() {
  return (
    <div className="signup-welcome-cards" aria-hidden="true">
      <div className="signup-float-card signup-float-job">
        <div className="signup-float-row">
          <span className="signup-float-avatar">LS</span>
          <div className="signup-float-copy"><strong>Early Childhood Educator</strong><span>Little Sprouts Daycare · 2.4 km</span></div>
        </div>
        <div className="signup-tag-row"><span className="signup-tag is-purple">Full-time</span><span className="signup-tag is-green">Applied · Shortlisted</span></div>
      </div>
      <div className="signup-float-card signup-float-centre">
        <div className="signup-float-art">
          <i className="signup-art-a" /><i className="signup-art-b" />
          <span className="signup-video-chip">▶ Welcome video</span>
        </div>
        <div className="signup-float-body"><strong>Cedar &amp; Moss Nature School</strong><span>3 new inquiries · 1 tour request</span></div>
      </div>
    </div>
  );
}

function ProfilePreview({ type }) {
  if (type === 'centre') {
    return (
      <div className="signup-preview-card">
        <div className="signup-preview-cover is-centre">
          <i className="signup-cover-a" /><i className="signup-cover-b" />
          <span className="signup-video-chip">▶ Welcome video · 30–90s</span>
        </div>
        <div className="signup-preview-body">
          <span className="signup-preview-avatar is-centre">YC</span>
          <div className="signup-preview-name"><strong>Your centre</strong><span>Programs · Ages served · Hours</span></div>
          <div className="signup-tag-row">
            <span className="signup-tag">Gallery</span><span className="signup-tag">Tours &amp; waitlist</span><span className="signup-tag is-purple">Post a job</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-preview-card">
      <div className="signup-preview-cover is-educator">
        <i className="signup-cover-a" />
        <span className="signup-play"><PlayIcon /></span>
        <span className="signup-video-chip is-corner">Intro video · 30–60s</span>
      </div>
      <div className="signup-preview-body">
        <span className="signup-preview-avatar">You</span>
        <div className="signup-preview-name"><strong>Your name</strong><span>Early Childhood Educator · Your city</span></div>
        <div className="signup-tag-row">
          <span className="signup-tag">Certifications</span><span className="signup-tag">Age groups</span><span className="signup-tag">Teaching philosophy</span>
        </div>
      </div>
    </div>
  );
}

/** Left panel: welcome cards on step 1, a profile preview and "what happens next" afterwards. */
export default function SignupSidebar({ accountType, step }) {
  const isStep1 = step === 1;
  const type = accountType || 'educator';
  const tone = isStep1 || type !== 'educator' ? 'purple' : 'green';
  const done = step >= 3 ? 1 : 0;

  return (
    <aside className={`signup-sidebar is-${tone}`}>
      <span className="signup-ring signup-ring-one" aria-hidden="true" />
      <span className="signup-ring signup-ring-two" aria-hidden="true" />

      <span className="signup-chip"><i />{isStep1 ? 'Free for educators & centres' : CHIPS[type]}</span>

      {isStep1 ? (
        <WelcomeCards />
      ) : (
        <div className="signup-preview">
          {type !== 'professional' && (
            <>
              <span className="signup-eyebrow">{type === 'centre' ? 'YOUR CENTRE PROFILE — PREVIEW' : 'YOUR EDUCATOR PROFILE — PREVIEW'}</span>
              <ProfilePreview type={type} />
            </>
          )}
        </div>
      )}

      <div className="signup-side-bottom">
        {isStep1 ? (
          <div className="signup-side-copy">
            <h2>Where early childhood comes together.</h2>
            <p>Free for educators and childcare centres across Canada.</p>
          </div>
        ) : (
          <div className="signup-next">
            <span className="signup-eyebrow">WHAT HAPPENS NEXT</span>
            <ol>
              {NEXT_STEPS[type].map((label, index) => {
                const state = index < done ? 'is-done' : index === done ? 'is-current' : '';
                return (
                  <li className={state} key={label}>
                    <span>{index < done ? '✓' : index + 1}</span>{label}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </aside>
  );
}
