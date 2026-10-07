const accountTypes = [
  {
    id: 'educator',
    title: 'Educator / ECE student',
    description: 'Find jobs and practicum placements near you.',
    benefits: [
      'Profile with intro video & teaching philosophy',
      'Search jobs by distance and apply in minutes',
      'Track applications · student practicum mode',
    ],
    icon: 'cap',
  },
  {
    id: 'centre',
    title: 'Childcare centre',
    description: 'Hire educators and showcase your centre to families.',
    benefits: [
      'Public profile with welcome video & gallery',
      'Post jobs and practicums, review applicants',
      'Manage parent inquiries, tours & waitlists',
    ],
    icon: 'building',
  },
];

function AccountIcon({ name }) {
  return name === 'cap' ? (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z" />
      <path d="M6.5 11.2v5.2c3.5 2.7 7.5 2.7 11 0v-5.2M21.5 9v6" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 11h2m4 0h.01M9 15h2m4 0h.01M10 21v-3h4v3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export default function AccountTypeStep({ selectedType, onSelect, onContinue }) {
  return (
    <>
      <div className="signup-step-indicator">
        <span className="signup-step-line active" />
        <span className="signup-step-line" />
        <span>STEP 1 OF 2 · ACCOUNT TYPE</span>
      </div>
      <div className="signup-intro">
        <h1>Welcome to Educator Connect</h1>
        <p>Tell us who you are and we’ll set up the right account for you.</p>
      </div>
      <fieldset className="signup-account-options" role="radiogroup" aria-label="I’m joining as">
        <legend>I’m joining as… <span aria-hidden="true">*</span></legend>
        {accountTypes.map((type) => {
          const selected = selectedType === type.id;
          return (
            <button
              className={`signup-account-card${selected ? ' is-selected' : ''}`}
              type="button"
              role="radio"
              aria-checked={selected}
              key={type.id}
              onClick={() => onSelect(type.id)}
            >
              <span className="signup-account-icon"><AccountIcon name={type.icon} /></span>
              <span className="signup-account-copy">
                <strong>{type.title}</strong>
                <span className="signup-account-description">{type.description}</span>
                <span className="signup-benefits">
                  {type.benefits.map((benefit) => (
                    <span key={benefit}><CheckIcon />{benefit}</span>
                  ))}
                </span>
              </span>
              <span className="signup-radio-mark" aria-hidden="true" />
            </button>
          );
        })}
      </fieldset>
      <button
        className="signup-primary-button"
        type="button"
        disabled={!selectedType}
        onClick={onContinue}
      >
        {selectedType === 'centre' ? 'Continue as centre' : selectedType === 'educator' ? 'Continue as educator' : 'Continue'}
        <span aria-hidden="true">→</span>
      </button>
      <div className="signup-secondary-links">
        <span>Looking for childcare? <a href="/">Parents don’t need an account</a></span>
        <span>Professional or service provider? <a href="/signup">Add or claim your directory listing</a></span>
      </div>
    </>
  );
}
