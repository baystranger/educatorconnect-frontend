import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSocialLoginUrl } from '../../services/authApi.js';
import { REGIONS, passwordStrength } from '../../utils/validation.js';

function GoogleMark() {
  return (
    <span className="signup-google-mark" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
        <path d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" />
        <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" fill="#FBBC05" />
        <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" fill="#EA4335" />
      </svg>
    </span>
  );
}

/** Sign up · 2 · Your details (educator or centre). */
export default function AccountDetailsStep({ accountType, onComplete, isSubmitting = false, serverError = null }) {
  const isCentre = accountType === 'centre';
  const isProfessional = accountType === 'professional';
  const role = isCentre ? 'childcare_centre' : isProfessional ? 'professional' : 'educator';
  const noun = isCentre ? 'centre' : isProfessional ? 'professional' : 'educator';
  const [values, setValues] = useState({ country: 'Canada', province: 'British Columbia' });
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [terms, setTerms] = useState(false);
  const [localError, setLocalError] = useState('');

  const strength = passwordStrength(values.password || '');
  const fieldError = (name) => serverError?.field?.(name);
  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }));

  function beginSocialSignup(provider) {
    window.location.assign(getSocialLoginUrl(provider, 'signup', role));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!terms) {
      setLocalError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }
    if (strength.score < 3) {
      setLocalError('Use at least 10 characters, including a number and a symbol.');
      return;
    }
    setLocalError('');
    await onComplete({
      role,
      first_name: values.first_name,
      last_name: values.last_name,
      centre_name: values.centre_name,
      contact_person: values.contact_person,
      phone: values.phone,
      address: values.address,
      email: values.email,
      password: values.password,
      password_confirmation: values.password,
      city: values.city,
      province: values.province,
      postal_code: values.postal_code,
      country: values.country,
      terms: true,
      is_student: role === 'educator' && isStudent,
    });
  }

  const input = (name, props = {}) => (
    <input name={name} value={values[name] || ''} onChange={set(name)} aria-invalid={fieldError(name) ? 'true' : undefined} {...props} />
  );
  const errorFor = (name) => fieldError(name) && <small className="signup-field-error" role="alert">{fieldError(name)}</small>;

  return (
    <>
      <div className="signup-step-indicator">
        <span className="signup-step-line active" />
        <span className="signup-step-line active" />
        <span>STEP 2 OF 2 · YOUR DETAILS</span>
      </div>
      <div className="signup-intro">
        <h1>Create your {noun} account</h1>
        <p>Sign up in one click with Google or LinkedIn, or use your email.</p>
      </div>
      <div className="signup-provider-row">
        <button type="button" onClick={() => beginSocialSignup('google')}>
          <GoogleMark />
          Sign up with Google
        </button>
        <button type="button" onClick={() => beginSocialSignup('linkedin')}>
          <span className="signup-linkedin-mark" aria-hidden="true">in</span>
          Sign up with LinkedIn
        </button>
      </div>
      <div className="signup-divider"><span>or</span></div>
      <form className="signup-form" onSubmit={handleSubmit} noValidate={false}>
        {isCentre ? (
          <div className="signup-field-grid">
            <label className="signup-field"><span>Centre name</span>{input('centre_name', { autoComplete: 'organization', required: true, maxLength: 255 })}{errorFor('centre_name')}</label>
            <label className="signup-field"><span>Contact person</span>{input('contact_person', { autoComplete: 'name', required: true, maxLength: 255 })}{errorFor('contact_person')}</label>
          </div>
        ) : (
          <div className="signup-field-grid">
            <label className="signup-field"><span>First name</span>{input('first_name', { autoComplete: 'given-name', required: true, maxLength: 100 })}{errorFor('first_name')}</label>
            <label className="signup-field"><span>Last name</span>{input('last_name', { autoComplete: 'family-name', required: true, maxLength: 100 })}{errorFor('last_name')}</label>
          </div>
        )}
        <label className="signup-field"><span>Email</span>{input('email', { type: 'email', placeholder: 'you@example.com', autoComplete: 'email', required: true })}{errorFor('email')}</label>
        {isCentre && (
          <>
            <label className="signup-field"><span>Phone</span>{input('phone', { type: 'tel', placeholder: '(604) 555-0123', autoComplete: 'tel', required: true })}{errorFor('phone')}</label>
            <label className="signup-field"><span>Street address</span>{input('address', { placeholder: 'Start typing your address', autoComplete: 'street-address', required: true })}{errorFor('address')}</label>
          </>
        )}
        <div className="signup-field-grid">
          <label className="signup-field"><span>City</span>{input('city', { autoComplete: 'address-level2', required: true })}{errorFor('city')}</label>
          <label className="signup-field"><span>Postal code</span>{input('postal_code', { placeholder: values.country === 'Canada' ? 'V5K 0A1' : '10001', autoComplete: 'postal-code', required: true })}{errorFor('postal_code')}</label>
        </div>
        <div className="signup-field-grid">
          <label className="signup-field">
            <span>Country</span>
            <select name="country" value={values.country} autoComplete="country-name"
              onChange={(event) => setValues((current) => ({ ...current, country: event.target.value, province: REGIONS[event.target.value][0] }))}>
              {Object.keys(REGIONS).map((country) => <option key={country}>{country}</option>)}
            </select>
          </label>
          <label className="signup-field">
            <span>{values.country === 'Canada' ? 'Province / territory' : 'State'}</span>
            <select name="province" value={values.province} onChange={set('province')} autoComplete="address-level1" required>
              {REGIONS[values.country].map((region) => <option key={region}>{region}</option>)}
            </select>
            {errorFor('province')}
          </label>
        </div>
        <label className="signup-field">
          <span>Password</span>
          <span className="signup-password-wrap">
            {input('password', { type: showPassword ? 'text' : 'password', autoComplete: 'new-password', minLength: 10, required: true })}
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </span>
          <span className="signup-password-hint">
            <span className="signup-strength-bars" aria-label={`Password strength: ${strength.label || 'none'}`}>
              {[1, 2, 3, 4].map((bar) => <i className={strength.score >= bar ? `strength-${strength.score}` : ''} key={bar} />)}
            </span>
            {strength.score ? `${strength.label} · ` : ''}10+ characters, a number &amp; a symbol
          </span>
          {errorFor('password')}
        </label>
        {role === 'educator' && (
          <button
            className={`signup-student-toggle${isStudent ? ' is-on' : ''}`}
            type="button"
            role="switch"
            aria-checked={isStudent}
            onClick={() => setIsStudent((value) => !value)}
          >
            <span className="signup-switch" aria-hidden="true"><i /></span>
            <span><strong>I’m an ECE student</strong><small>Adds practicum details to your profile.</small></span>
          </button>
        )}
        <label className="signup-terms">
          <input name="terms" type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
          <span className="signup-custom-checkbox" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
          </span>
          <span>I agree to the <Link to="/#footer">Terms &amp; Conditions</Link> and <Link to="/#footer">Privacy Policy</Link>.</span>
        </label>
        {(localError || (serverError && !Object.keys(serverError.errors || {}).length) || serverError?.field?.('terms')) && (
          <p className="signup-provider-notice" role="alert">{localError || serverError?.field?.('terms') || serverError.message}</p>
        )}
        <button className="signup-primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : `Create ${noun} account`}
        </button>
      </form>
    </>
  );
}
