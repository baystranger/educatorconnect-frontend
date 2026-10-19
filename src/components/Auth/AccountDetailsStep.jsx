import { useState } from 'react';
import { Link } from 'react-router-dom';
import { REGIONS } from '../../utils/validation.js';
import { Check } from './AccountTypeStep.jsx';

const NOUNS = { educator: 'educator', centre: 'centre', professional: 'professional' };
const PROVIDER_NAMES = { google: 'Google', linkedin: 'LinkedIn' };
const STRENGTH_COLOURS = ['#C2410C', '#B86E00', '#016516', '#016516'];
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

/** 0–4: length 6+, length 10+, a number, a symbol. The API requires all four. */
function strengthOf(password) {
  if (!password) return 0;
  return Math.min(4, (password.length >= 6 ? 1 : 0) + (password.length >= 10 ? 1 : 0) + (/\d/.test(password) ? 1 : 0) + (/[^A-Za-z0-9]/.test(password) ? 1 : 0));
}

function GoogleMark() {
  return (
    <span className="signup-google-mark">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
        <path d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" />
        <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" fill="#FBBC05" />
        <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" fill="#EA4335" />
      </svg>
    </span>
  );
}

function LinkedInMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#0A66C2" />
      <path d="M7 10v7M7 7v.01M11 17v-4.2c0-1.6 1-2.6 2.3-2.6s2.2 1 2.2 2.6V17M11 10v7" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
    </svg>
  );
}

/**
 * Sign up · 2 · Your details. Google/LinkedIn or email first; the form opens once one
 * is chosen. Connected accounts skip name, email and password — the provider shared them.
 */
export default function AccountDetailsStep({
  accountType, via, emailOpen, notice, isSubmitting, serverError,
  onConnect, onClearVia, onOpenEmail, onSubmit,
}) {
  const isCentre = accountType === 'centre';
  const isEdu = accountType === 'educator';
  const noun = NOUNS[accountType] || 'educator';
  const hasVia = Boolean(via);
  const showForm = emailOpen || hasVia;

  const [values, setValues] = useState({ country: 'Canada', province: REGIONS.Canada[0] });
  const [showPassword, setShowPassword] = useState(false);
  const [student, setStudent] = useState(false);
  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const isCanada = values.country === 'Canada';
  const score = strengthOf(values.password || '');
  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }));
  const fieldError = (name) => serverError?.field?.(name);
  // Errors not shown beside a visible field (expired connection, email taken on a connected account, network).
  const visibleFields = hasVia
    ? ['centre_name', 'phone', 'address', 'city', 'postal_code', 'province', 'terms']
    : ['first_name', 'last_name', 'email', 'centre_name', 'phone', 'contact_person', 'address', 'city', 'postal_code', 'province', 'password', 'terms'];
  const generalError = serverError && !visibleFields.some((name) => fieldError(name))
    ? fieldError('token') || fieldError('email') || serverError.message
    : '';

  function handleSubmit(event) {
    event.preventDefault();
    let blocked = false;
    if (!hasVia && score < 4) {
      setPasswordError('Use at least 10 characters, including a number and a symbol.');
      blocked = true;
    } else {
      setPasswordError('');
    }
    if (!agree) {
      setAgreeError(true);
      blocked = true;
    }
    if (blocked) return;

    const location = {
      city: values.city,
      postal_code: values.postal_code,
      country: values.country,
      province: values.province,
      terms: true,
      is_student: isEdu && student,
    };
    const centre = isCentre ? { centre_name: values.centre_name, phone: values.phone, address: values.address } : {};

    if (hasVia) {
      onSubmit({ ...location, ...centre });
      return;
    }

    onSubmit({
      ...location,
      ...centre,
      role: isCentre ? 'childcare_centre' : accountType === 'professional' ? 'professional' : 'educator',
      first_name: values.first_name,
      last_name: values.last_name,
      contact_person: values.contact_person,
      email: values.email,
      password: values.password,
      password_confirmation: values.password,
    });
  }

  const field = (label, name, props = {}) => (
    <label className="signup-field">
      {label}
      <input
        name={name}
        value={values[name] || ''}
        onChange={set(name)}
        aria-invalid={fieldError(name) ? 'true' : undefined}
        required
        {...props}
      />
      {fieldError(name) && <small className="signup-field-error" role="alert">{fieldError(name)}</small>}
    </label>
  );

  return (
    <div className="signup-stack signup-gap-20">
      <div className="signup-intro">
        <h1 className="signup-h2">Create your {noun} account</h1>
        <p>{hasVia ? 'Add a few details so we can show you what’s nearby.' : 'Sign up in one click with Google or LinkedIn, or use your email.'}</p>
      </div>

      {notice && <div className="signup-notice" role="alert">{notice}</div>}

      {!hasVia && (
        <div className="signup-stack signup-gap-18">
          <div className="signup-grid-2 signup-providers">
            <button type="button" className="signup-btn signup-provider" onClick={() => onConnect('google')}>
              <GoogleMark />Sign up with Google
            </button>
            <button type="button" className="signup-btn signup-provider" onClick={() => onConnect('linkedin')}>
              <LinkedInMark />Sign up with LinkedIn
            </button>
          </div>
          <div className="signup-or"><span />or<span /></div>
          {!showForm && (
            <button type="button" className="signup-outline" onClick={onOpenEmail}>
              <MailIcon />Sign up with email &amp; password
            </button>
          )}
        </div>
      )}

      {hasVia && (
        <div className="signup-connected">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#016516" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" /><path d="M8 12.5l2.8 2.8L16.5 9.5" />
          </svg>
          <span><strong>Connected with {PROVIDER_NAMES[via.provider] || 'your account'}.</strong> We’ve added your name and email — just a few more details.</span>
          <button type="button" onClick={onClearVia}>Change</button>
        </div>
      )}

      {showForm && (
        <form className="signup-stack signup-gap-14" onSubmit={handleSubmit} noValidate={false}>
          {!hasVia && !isCentre && (
            <div className="signup-stack signup-gap-14">
              <div className="signup-grid-2 signup-field-grid">
                {field('First name', 'first_name', { autoComplete: 'given-name', maxLength: 100 })}
                {field('Last name', 'last_name', { autoComplete: 'family-name', maxLength: 100 })}
              </div>
              {field('Email', 'email', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com', maxLength: 255 })}
            </div>
          )}

          {isCentre && (
            <div className="signup-stack signup-gap-14">
              <div className="signup-grid-2 signup-field-grid">
                {field('Centre name', 'centre_name', { autoComplete: 'organization', maxLength: 255 })}
                {field('Phone', 'phone', { type: 'tel', autoComplete: 'tel', placeholder: '(604) 555-0123', maxLength: 30 })}
              </div>
              {!hasVia && (
                <div className="signup-grid-2 signup-field-grid">
                  {field('Contact person', 'contact_person', { autoComplete: 'name', maxLength: 255 })}
                  {field('Email', 'email', { type: 'email', autoComplete: 'email', placeholder: 'director@yourcentre.ca', maxLength: 255 })}
                </div>
              )}
              {field('Street address', 'address', { autoComplete: 'street-address', placeholder: '123 Main Street', maxLength: 500 })}
            </div>
          )}

          <div className="signup-grid-2 signup-field-grid">
            {field('City', 'city', { autoComplete: 'address-level2', maxLength: 100 })}
            {field(isCanada ? 'Postal code' : 'ZIP code', 'postal_code', { autoComplete: 'postal-code', placeholder: isCanada ? 'V5K 0A1' : '98101', maxLength: 20 })}
            <label className="signup-field">
              Country
              <select
                name="country"
                value={values.country}
                autoComplete="country-name"
                onChange={(event) => setValues((current) => ({ ...current, country: event.target.value, province: REGIONS[event.target.value][0] }))}
              >
                {Object.keys(REGIONS).map((country) => <option key={country} value={country}>{country}</option>)}
              </select>
            </label>
            <label className="signup-field">
              {isCanada ? 'Province / territory' : 'State'}
              <select name="province" value={values.province} autoComplete="address-level1" onChange={set('province')} required>
                {REGIONS[values.country].map((region) => <option key={region} value={region}>{region}</option>)}
              </select>
              {fieldError('province') && <small className="signup-field-error" role="alert">{fieldError('province')}</small>}
            </label>
          </div>

          {!hasVia && (
            <label className="signup-field">
              Password
              <span className={`signup-password${passwordError || fieldError('password') ? ' is-invalid' : ''}`}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.password || ''}
                  onChange={(event) => { set('password')(event); setPasswordError(''); }}
                  required
                />
                <button type="button" onClick={() => setShowPassword((on) => !on)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
              <span className="signup-strength" aria-live="polite">
                {[0, 1, 2, 3].map((bar) => (
                  <i key={bar} style={{ background: bar < score ? STRENGTH_COLOURS[score - 1] : '#E7E0EA' }} />
                ))}
                <span>{score === 0 ? '10+ characters, a number & a symbol' : STRENGTH_LABELS[score]}</span>
              </span>
              {(passwordError || fieldError('password')) && (
                <small className="signup-field-error" role="alert">{passwordError || fieldError('password')}</small>
              )}
            </label>
          )}

          {isEdu && (
            <button type="button" className={`signup-student${student ? ' is-on' : ''}`} aria-pressed={student} onClick={() => setStudent((on) => !on)}>
              <span className="signup-switch" aria-hidden="true"><i /></span>
              <span className="signup-student-copy"><strong>I’m an ECE student</strong><span>Adds practicum details to your profile.</span></span>
            </button>
          )}

          <div className={`signup-agree${agree ? ' is-on' : ''}${agreeError ? ' is-error' : ''}`}>
            <button
              type="button"
              role="checkbox"
              aria-checked={agree}
              aria-label="I agree to the Terms & Conditions and Privacy Policy"
              className="signup-checkbox"
              onClick={() => { setAgree((on) => !on); setAgreeError(false); }}
            >
              <Check size={12} width={3.4} color="#FFFFFF" />
            </button>
            <span onClick={() => { setAgree((on) => !on); setAgreeError(false); }}>
              I agree to the <Link to="/#footer" onClick={(event) => event.stopPropagation()}>Terms &amp; Conditions</Link> and{' '}
              <Link to="/#footer" onClick={(event) => event.stopPropagation()}>Privacy Policy</Link>.
            </span>
          </div>
          {(agreeError || fieldError('terms')) && (
            <span className="signup-error-text signup-pull-up" role="alert">Please accept the Terms to create your account.</span>
          )}

          {generalError && <span className="signup-error-text" role="alert">{generalError}</span>}

          <button type="submit" className="signup-btn signup-submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Creating account…'
              : isCentre ? 'Create centre account' : isEdu && student ? 'Create student account' : `Create ${noun} account`}
          </button>
        </form>
      )}

      {!showForm && (
        <p className="signup-fineprint">
          By signing up, you agree to Educator Connect’s <Link to="/#footer">Terms &amp; Conditions</Link> and <Link to="/#footer">Privacy Policy</Link>.
        </p>
      )}
    </div>
  );
}
