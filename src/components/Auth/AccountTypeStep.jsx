import { Link } from 'react-router-dom';

const ACCOUNT_TYPES = [
  {
    id: 'educator',
    label: 'Educator / ECE student',
    sub: 'Find jobs and practicum placements near you.',
    features: ['Profile with intro video & teaching philosophy', 'Search jobs by distance and apply in minutes', 'Track applications · student practicum mode'],
  },
  {
    id: 'centre',
    label: 'Childcare centre',
    sub: 'Hire educators and showcase your centre to families.',
    features: ['Public profile with welcome video & gallery', 'Post jobs and practicums, review applicants', 'Manage parent inquiries, tours & waitlists'],
  },
];

function TypeIcon({ id }) {
  return id === 'educator' ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" />
    </svg>
  );
}

export function Check({ size = 16, width = 2.6, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Sign up · 1 · Account type. */
export default function AccountTypeStep({ selectedType, showError, onSelect, onContinue, onProfessional }) {
  const continueLabel = selectedType === 'educator' ? 'Continue as educator' : selectedType === 'centre' ? 'Continue as centre' : 'Continue';

  return (
    <div className="signup-stack signup-gap-22">
      <div className="signup-intro">
        <h1 className="signup-h1">Welcome to Educator Connect</h1>
        <p>Tell us who you are and we’ll set up the right account for you.</p>
      </div>

      <div className="signup-types" role="radiogroup" aria-labelledby="acct-label" aria-required="true">
        <span id="acct-label" className="signup-types-label">I’m joining as… <span className="signup-required">*</span></span>
        {ACCOUNT_TYPES.map((type) => {
          const on = selectedType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`signup-type${on ? ' is-on' : ''}${showError ? ' is-error' : ''}`}
              onClick={() => onSelect(type.id)}
            >
              <span className="signup-type-icon"><TypeIcon id={type.id} /></span>
              <span className="signup-type-copy">
                <strong>{type.label}</strong>
                <span className="signup-type-sub">{type.sub}</span>
                <span className="signup-type-features">
                  {type.features.map((feature) => <span key={feature}><Check color={on ? '#42007B' : '#8A8496'} />{feature}</span>)}
                </span>
              </span>
              <span className="signup-type-radio"><Check size={14} width={3.2} color="#FFFFFF" /></span>
            </button>
          );
        })}
      </div>

      {showError && <span className="signup-error-text signup-pull-up" role="alert">Please choose an account type to continue.</span>}

      <button type="button" className={`signup-btn signup-continue${selectedType ? '' : ' is-idle'}`} aria-disabled={!selectedType} onClick={onContinue}>
        {continueLabel}<Arrow />
      </button>

      <div className="signup-alt-links">
        <span>Looking for childcare? <Link to="/childcare">Parents don’t need an account</Link></span>
        <span>Professional or service provider? <button type="button" className="signup-link-btn" onClick={onProfessional}>Add or claim your directory listing</button></span>
      </div>
    </div>
  );
}
