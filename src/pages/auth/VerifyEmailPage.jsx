import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../../components/Auth/signin.css';
import { homePathFor } from '../../constants/roles.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

/** Landing page for the link in the verification email (the API verifies, then redirects here). */
export default function VerifyEmailPage() {
  useDocumentTitle('Email verification');
  const [params] = useSearchParams();
  const { user, refresh } = useAuth();
  const verified = params.get('status') === 'verified';

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <main className="signin-oauth-callback" aria-live="polite">
      <img src="/educator-connect-logo.png" alt="Educator Connect" />
      <h1>{verified ? 'Your email is verified' : 'This link didn’t work'}</h1>
      <p>
        {verified
          ? 'Thanks — your account is active. You can close this tab or continue below.'
          : 'The verification link is invalid or has expired. Sign in and request a new one.'}
      </p>
      {user ? <Link to={homePathFor(user)}>Continue to your dashboard</Link> : <Link to="/signin">Sign in</Link>}
    </main>
  );
}
