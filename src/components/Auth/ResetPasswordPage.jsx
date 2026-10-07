import { useState } from 'react';
import { resetPassword } from '../../services/authApi.js';
import SignInSidebar from './SignInSidebar.jsx';
import './signin.css';

export default function ResetPasswordPage() {
  const params = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await resetPassword({
        token: params.get('token') || '',
        email,
        password,
        password_confirmation: confirmation,
      });
      window.location.replace('/signin?reset=success');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="signin-page min-h-screen w-full">
      <main className="signin-main">
        <a className="signin-logo" href="/" aria-label="Educator Connect home">
          <img src="/educator-connect-logo.png" alt="Educator Connect" />
        </a>
        <div className="signin-content">
          <div className="signin-content-inner">
            <form className="signin-form signin-reset" onSubmit={handleSubmit}>
              <button className="signin-back" type="button" onClick={() => window.location.assign('/signin')}>
                <span aria-hidden="true">←</span> Back to sign in
              </button>
              <span className="signin-reset-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </span>
              <div className="signin-intro">
                <h1>Choose a new password</h1>
                <p>Use at least 10 characters, including a number and a symbol.</p>
              </div>
              <label className="signin-field">
                <span>Email</span>
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="signin-field">
                <span>New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength="10"
                  pattern="(?=.*[0-9])(?=.*[^A-Za-z0-9]).{10,}"
                  title="Use at least 10 characters, including a number and a symbol."
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
              <label className="signin-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  required
                />
              </label>
              {error && <p className="signin-demo-notice" role="alert">{error}</p>}
              <button className="signin-submit" type="submit" disabled={busy || !params.get('token')}>
                {busy ? 'Updating password…' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
        <nav className="signin-legal" aria-label="Legal and support">
          <a href="/">Terms</a>
          <a href="/">Privacy</a>
          <a href="/">Help Centre</a>
        </nav>
      </main>
      <SignInSidebar />
    </div>
  );
}
