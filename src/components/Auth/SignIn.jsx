import { useEffect, useState } from 'react';
import { getSocialLoginUrl, loginAccount, requestPasswordReset } from '../../services/authApi.js';
import SignInSidebar from './SignInSidebar.jsx';
import './signin.css';

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34A853" />
      <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" fill="#FBBC05" />
      <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" fill="#EA4335" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path d="M7 10v7M7 7v.01M11 17v-4.2c0-1.6 1-2.6 2.3-2.6s2.2 1 2.2 2.6V17M11 10v7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function EmailField({ value, onChange }) {
  return (
    <label className="signin-field">
      <span>Email</span>
      <input
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </label>
  );
}

function ResetPasswordForm({ onBack }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="signin-form signin-reset" onSubmit={handleSubmit}>
      <button className="signin-back" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to sign in
      </button>
      <span className="signin-reset-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
      </span>
      <div className="signin-intro">
        <h1>Reset your password</h1>
        <p>Enter the email on your account and we’ll send a secure link to choose a new password.</p>
      </div>
      <EmailField value={email} onChange={(value) => { setEmail(value); setSent(false); setError(''); }} />
      {sent && (
        <div className="signin-reset-feedback" role="status">
          <span aria-hidden="true">✓</span>
          <span>If an account exists for that email, password reset instructions are on their way.</span>
        </div>
      )}
      {error && <p className="signin-demo-notice" role="alert">{error}</p>}
      <button className="signin-submit" type="submit" disabled={busy}>
        {busy ? 'Sending…' : sent ? 'Resend link' : 'Send reset link'}
      </button>
    </form>
  );
}

function LoginForm({ onForgot, initialNotice = '' }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [notice, setNotice] = useState(initialNotice);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const { user } = await loginAccount({ email, password, remember: keepSignedIn });
      window.location.assign(user.role === 'educator' ? '/educator/dashboard' : '/centre/dashboard');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  function beginSocialLogin(provider) {
    window.location.assign(getSocialLoginUrl(provider, 'login'));
  }

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <div className="signin-intro">
        <h1>Welcome back</h1>
        <p>Sign in to your educator, centre or professional account.</p>
      </div>
      <div className="signin-socials">
        <button className="signin-social-button" type="button" onClick={() => beginSocialLogin('google')}>
          <GoogleMark /> Continue with Google
        </button>
        <button className="signin-social-button" type="button" onClick={() => beginSocialLogin('linkedin')}>
          <LinkedInMark /> Continue with LinkedIn
        </button>
      </div>
      <div className="signin-divider"><span />or with email<span /></div>
      <EmailField value={email} onChange={(value) => { setEmail(value); setNotice(''); }} />
      <div className="signin-field">
        <span className="signin-password-label">
          <label htmlFor="signin-password">Password</label>
          <button className="signin-forgot" type="button" onClick={onForgot}>Forgot password?</button>
        </span>
        <span className="signin-password-input">
          <input
            id="signin-password"
            type={passwordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setNotice(''); }}
            required
          />
          <button className="signin-password-toggle" type="button" onClick={() => setPasswordVisible((visible) => !visible)}>
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
        </span>
      </div>
      <label className="signin-remember">
        <input type="checkbox" checked={keepSignedIn} onChange={(event) => setKeepSignedIn(event.target.checked)} />
        <span>Keep me signed in on this device</span>
      </label>
      {notice && <p className="signin-demo-notice" role="alert">{notice}</p>}
      <button className="signin-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <p className="signin-signup-prompt">New to Educator Connect? <a href="/signup">Create an account</a></p>
    </form>
  );
}

function ChildcareCard() {
  return (
    <a className="signin-childcare-card" href="/">
      <span className="signin-childcare-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m3 11 9-7 9 7M5 10v10h14V10M10 20v-5h4v5" /></svg>
      </span>
      <span className="signin-childcare-copy">
        <strong>Looking for childcare?</strong>
        <span>Parents can search and contact centres without an account.</span>
      </span>
      <svg className="signin-childcare-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
    </a>
  );
}

export default function SignIn() {
  const [view, setView] = useState('login');
  const oauthError = new URLSearchParams(window.location.search).get('oauth_error');
  const oauthNotices = {
    cancelled: 'Social sign-in was cancelled.',
    expired: 'This social sign-in expired. Please try again.',
    account_conflict: 'This social account could not be linked. Sign in with the existing account first.',
    success: 'Your password was updated. Sign in with your new password.',
  };
  if (new URLSearchParams(window.location.search).get('reset') === 'success') {
    oauthNotices.success = 'Your password was updated. Sign in with your new password.';
  }

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Educator Connect — Sign in';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="signin-page min-h-screen w-full">
      <main className="signin-main">
        <a className="signin-logo" href="/" aria-label="Educator Connect home">
          <img src="/educator-connect-logo.png" alt="Educator Connect" />
        </a>
        <div className="signin-content">
          <div className="signin-content-inner">
            {view === 'login'
              ? <LoginForm onForgot={() => setView('reset')} initialNotice={oauthNotices[oauthError] || ''} />
              : <ResetPasswordForm onBack={() => setView('login')} />}
            <ChildcareCard />
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
