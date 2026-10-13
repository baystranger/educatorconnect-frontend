import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { resetPassword } from '../../services/authApi.js';
import { passwordStrength } from '../../utils/validation.js';
import { SignInShell } from './SignInPage.jsx';

export default function ResetPasswordPage() {
  useDocumentTitle('Educator Connect — Choose a new password');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(token ? '' : 'This reset link is incomplete. Request a new one from the sign-in page.');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!passwordStrength(password).valid) {
      setError('Use at least 10 characters, including a number and a symbol.');
      return;
    }
    if (password !== confirmation) {
      setError('The passwords don’t match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await resetPassword({ token, email, password, password_confirmation: confirmation });
      navigate('/signin?reset=success', { replace: true });
    } catch (requestError) {
      setError(requestError.field('email') || requestError.field('password') || requestError.message);
      setBusy(false);
    }
  }

  return (
    <SignInShell>
      <form className="signin-form signin-reset" onSubmit={handleSubmit}>
        <button className="signin-back" type="button" onClick={() => navigate('/signin')}>
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
          <input type="password" autoComplete="new-password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <label className="signin-field">
          <span>Confirm new password</span>
          <input type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
        </label>
        {error && <p className="signin-demo-notice" role="alert">{error}</p>}
        <button className="signin-submit" type="submit" disabled={busy || !token}>
          {busy ? 'Updating password…' : 'Update password'}
        </button>
      </form>
    </SignInShell>
  );
}
