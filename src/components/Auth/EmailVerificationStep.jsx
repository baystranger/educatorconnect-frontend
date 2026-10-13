import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { changeEmail } from '../../services/accountApi.js';
import { resendVerificationEmail } from '../../services/authApi.js';

const POLL_MS = 5000;

/**
 * Step 3 · Check your email. Polls the signed-in account until the link in the
 * email has been clicked (possibly on another device), then continues.
 */
export default function EmailVerificationStep({ email, accountType, onVerified }) {
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
    <div className="signup-verify">
      <div className="signup-step-indicator">
        <span className="signup-step-line active" />
        <span className="signup-step-line active" />
        <span>ALMOST DONE</span>
      </div>
      <span className="signup-verify-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
      </span>
      <div>
        <h1>Check your email</h1>
        <p>
          We sent a verification link to <strong>{currentEmail}</strong>. Click it to activate your {noun} account — it expires in 24 hours.
        </p>
      </div>
      <div className="signup-verify-actions">
        <a href="mailto:">Open email app</a>
        <button type="button" onClick={resend} disabled={resendState !== 'idle'}>
          {resendState === 'sending' ? 'Sending…' : resendState === 'sent' ? 'Sent again ✓' : 'Resend email'}
        </button>
      </div>
      {error && <p className="signup-provider-notice" role="alert">{error}</p>}
      <div className="signup-verify-help">
        <strong>Didn’t get it?</strong>
        <span>
          Check your spam folder, or{' '}
          <button type="button" className="signup-inline-link" onClick={() => setChanging((open) => !open)}>
            go back and fix your email address
          </button>.
        </span>
        {changing && (
          <form className="signup-verify-change" onSubmit={submitNewEmail}>
            <label className="signup-field">
              <span>Email</span>
              <input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} autoComplete="email" required />
            </label>
            <label className="signup-field">
              <span>Password</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </label>
            <button className="signup-primary-button" type="submit">Update email &amp; resend</button>
          </form>
        )}
      </div>
      <span className="signup-verify-status" aria-live="polite">This page continues automatically once your email is verified.</span>
    </div>
  );
}
