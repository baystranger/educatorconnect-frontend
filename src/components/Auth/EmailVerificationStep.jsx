import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { changeEmail } from '../../services/accountApi.js';
import { resendVerificationEmail } from '../../services/authApi.js';

const POLL_MS = 5000;

/**
 * Sign up · 3 · Check your email. Polls the signed-in account until the link in the
 * email has been clicked (possibly on another device), then continues.
 */
export default function EmailVerificationStep({ email, accountType, hasPassword = true, onVerified }) {
  const { refresh, setUser } = useAuth();
  const [resendState, setResendState] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');
  const [changing, setChanging] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState('');
  const [currentEmail, setCurrentEmail] = useState(email);
  const noun = { centre: 'centre', professional: 'professional' }[accountType] || 'educator';

  useEffect(() => {
    let active = true;
    const timer = setInterval(async () => {
      const user = await refresh();
      if (active && user?.email_verified) onVerified(user);
    }, POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [refresh, onVerified]);

  async function resend() {
    setResendState('sending');
    setError('');
    try {
      await resendVerificationEmail();
      setResendState('sent');
    } catch (requestError) {
      setError(requestError.message);
      setResendState('idle');
    }
  }

  async function submitNewEmail(event) {
    event.preventDefault();
    setError('');
    try {
      const payload = await changeEmail(newEmail, password);
      setUser(payload.data);
      setCurrentEmail(payload.data.email);
      setChanging(false);
      setPassword('');
      setResendState('sent');
    } catch (requestError) {
      setError(requestError.field?.('email') || requestError.field?.('current_password') || requestError.message);
    }
  }

  return (
    <div className="signup-stack signup-gap-22">
      <span className="signup-verify-icon" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
        </svg>
      </span>
      <div className="signup-intro">
        <h1 className="signup-h2">Check your email</h1>
        <p className="signup-verify-copy">
          We sent a verification link to <strong>{currentEmail}</strong>. Click it to activate your {noun} account — it expires in 24 hours.
        </p>
      </div>
      <div className="signup-grid-2 signup-verify-actions">
        <a href="mailto:" className="signup-btn signup-verify-open">Open email app</a>
        <button type="button" className="signup-outline" onClick={resend} disabled={resendState !== 'idle'}>
          {resendState === 'sending' ? 'Sending…' : resendState === 'sent' ? 'Sent again ✓' : 'Resend email'}
        </button>
      </div>
      {error && <span className="signup-error-text" role="alert">{error}</span>}
      <div className="signup-help">
        <strong>Didn’t get it?</strong>
        <span>
          Check your spam folder, or{' '}
          <button type="button" className="signup-link-btn" onClick={() => setChanging((open) => !open)}>
            go back and fix your email address
          </button>.
        </span>
        {changing && (
          <form className="signup-stack signup-gap-14 signup-help-form" onSubmit={submitNewEmail}>
            <label className="signup-field">
              Email
              <input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} autoComplete="email" required />
            </label>
            {/* Google/LinkedIn accounts have no password; the API doesn't ask them for one. */}
            {hasPassword && (
              <label className="signup-field">
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
              </label>
            )}
            <button className="signup-btn signup-submit" type="submit">Update email &amp; resend</button>
          </form>
        )}
      </div>
      <span className="signup-sr-only" aria-live="polite">This page continues automatically once your email is verified.</span>
    </div>
  );
}
