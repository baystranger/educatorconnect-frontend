import { useState } from 'react';
import { getSocialLoginUrl } from '../../services/authApi.js';

const locations = {
  Canada: [
    'British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba', 'Ontario',
    'Quebec', 'New Brunswick', 'Nova Scotia', 'Prince Edward Island',
    'Newfoundland and Labrador', 'Yukon', 'Northwest Territories', 'Nunavut',
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  ],
};

export default function AccountDetailsStep({
  accountType,
  onBack,
  onComplete,
  isSubmitting = false,
  serverError = '',
}) {
  const [emailOpen, setEmailOpen] = useState(
    () => window.matchMedia('(max-width: 760px)').matches,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [providerNotice, setProviderNotice] = useState('');
  const [country, setCountry] = useState('Canada');
  const [region, setRegion] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const role = accountType === 'centre' ? 'centre' : 'educator';
  const noun = role === 'centre' ? 'centre' : 'educator';
  const strength = Math.min(
    4,
    (password.length >= 10 ? 1 : 0)
      + (password.length >= 14 ? 1 : 0)
      + (/\d/.test(password) ? 1 : 0)
      + (/[^A-Za-z0-9]/.test(password) ? 1 : 0),
  );
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setProviderNotice('Passwords do not match.');
      return;
    }
    setProviderNotice('');
    const fields = new FormData(event.currentTarget);
    await onComplete({
      role: accountType === 'centre' ? 'childcare_centre' : 'educator',
      first_name: fields.get('firstName') || undefined,
      last_name: fields.get('lastName') || undefined,
      centre_name: fields.get('centreName') || undefined,
      contact_person: fields.get('contactPerson') || undefined,
      phone: fields.get('phone') || undefined,
      address: fields.get('streetAddress') || undefined,
      email: fields.get('email'),
      password: fields.get('password'),
      password_confirmation: fields.get('password_confirmation'),
      city: fields.get('city'),
      province: fields.get('region'),
      postal_code: fields.get('postalCode'),
      country: fields.get('country'),
      terms: fields.get('terms') === 'on',
      is_student: isStudent,
    });
  }

  function beginSocialSignup(provider) {
    const roleName = role === 'centre' ? 'childcare_centre' : 'educator';
    window.location.assign(getSocialLoginUrl(provider, 'signup', roleName));
  }

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
          <span className="signup-google-mark" aria-hidden="true">G</span>
          Sign up with Google
        </button>
        <button type="button" onClick={() => beginSocialSignup('linkedin')}>
          <span className="signup-linkedin-mark" aria-hidden="true">in</span>
          Sign up with LinkedIn
        </button>
      </div>
      {providerNotice && <p className="signup-provider-notice" role="status">{providerNotice}</p>}
      <div className="signup-divider"><span>or</span></div>
      {!emailOpen ? (
        <button className="signup-email-toggle" type="button" onClick={() => setEmailOpen(true)}>
          <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          Sign up with email &amp; password
        </button>
      ) : (
        <form className="signup-form" onSubmit={handleSubmit}>
          {providerNotice && <p className="signup-provider-notice" role="alert">{providerNotice}</p>}
          {role === 'centre' ? (
            <div className="signup-field-grid">
              <label className="signup-field">
                <span>Centre name</span>
                <input name="centreName" autoComplete="organization" required />
              </label>
              <label className="signup-field">
                <span>Contact person</span>
                <input name="contactPerson" autoComplete="name" required />
              </label>
            </div>
          ) : (
            <div className="signup-field-grid">
              <label className="signup-field">
                <span>First name</span>
                <input name="firstName" autoComplete="given-name" required />
              </label>
              <label className="signup-field">
                <span>Last name</span>
                <input name="lastName" autoComplete="family-name" required />
              </label>
            </div>
          )}
          <label className="signup-field">
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          </label>
          {role === 'centre' && (
            <>
              <label className="signup-field">
                <span>Phone</span>
                <input name="phone" type="tel" placeholder="(604) 555-0123" autoComplete="tel" required />
              </label>
              <label className="signup-field">
                <span>Street address</span>
                <input name="streetAddress" placeholder="Start typing your address" autoComplete="street-address" required />
              </label>
            </>
          )}
          <div className="signup-field-grid">
            <label className="signup-field">
              <span>City</span>
              <input name="city" autoComplete="address-level2" required />
            </label>
            <label className="signup-field">
              <span>Postal code</span>
              <input name="postalCode" placeholder={country === 'Canada' ? 'V5K 0A1' : '10001'} autoComplete="postal-code" required />
            </label>
          </div>
          <div className="signup-field-grid">
            <label className="signup-field">
              <span>Country</span>
              <select
                name="country"
                value={country}
                autoComplete="country-name"
                onChange={(event) => {
                  setCountry(event.target.value);
                  setRegion('');
                }}
              >
                {Object.keys(locations).map((location) => <option key={location}>{location}</option>)}
              </select>
            </label>
            <label className="signup-field">
              <span>{country === 'Canada' ? 'Province / territory' : 'State'}</span>
              <select
                name="region"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                autoComplete="address-level1"
                required
              >
                <option value="" disabled>Select {country === 'Canada' ? 'province / territory' : 'state'}</option>
                {locations[country].map((location) => <option key={location}>{location}</option>)}
              </select>
            </label>
          </div>
          <label className="signup-field">
            <span>Password</span>
            <span className="signup-password-wrap">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={10}
                pattern="(?=.*[0-9])(?=.*[^A-Za-z0-9]).{10,}"
                title="Use at least 10 characters, including a number and a symbol."
                required
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
            <span className="signup-password-hint">
              <span className="signup-strength-bars" aria-label={`Password strength: ${strengthLabel}`}>
                {[1, 2, 3, 4].map((bar) => <i className={strength >= bar ? `strength-${strength}` : ''} key={bar} />)}
              </span>
              {strength ? `${strengthLabel} · ` : ''}10+ characters, a number &amp; a symbol
            </span>
          </label>
          <label className="signup-field">
            <span>Confirm password</span>
            <input
              name="password_confirmation"
              type={showPassword ? 'text' : 'password'}
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          {role === 'educator' && (
            <button
              className={`signup-student-toggle${isStudent ? ' is-on' : ''}`}
              type="button"
              aria-pressed={isStudent}
              onClick={() => setIsStudent((value) => !value)}
            >
              <span className="signup-switch" aria-hidden="true"><i /></span>
              <span><strong>I’m an ECE student</strong><small>Adds practicum details to your profile.</small></span>
            </button>
          )}
          <label className="signup-terms">
            <input name="terms" type="checkbox" required />
            <span className="signup-custom-checkbox" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            </span>
            <span>I agree to the <a href="#terms">Terms &amp; Conditions</a> and <a href="#privacy">Privacy Policy</a>.</span>
          </label>
          {serverError && <p className="signup-provider-notice" role="alert">{serverError}</p>}
          <button className="signup-primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : `Create ${noun} account`}
          </button>
        </form>
      )}
      <p className="signup-legal-note">
        By signing up, you agree to Educator Connect’s <a href="#terms">Terms &amp; Conditions</a> and <a href="#privacy">Privacy Policy</a>.
      </p>
    </>
  );
}
