import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../../components/Auth/signin.css';
import { homePathFor } from '../../constants/roles.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { exchangeOAuthCode } from '../../services/authApi.js';

/** Receives the single-use code from the API's OAuth callback and starts the session. */
export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [message, setMessage] = useState('Finishing your secure sign-in…');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const code = params.get('code');
    if (!code) {
      setMessage('This sign-in link is missing its temporary code. Please try again.');
      return;
    }
    exchangeOAuthCode(code)
      .then(({ user }) => {
        signIn(user);
        navigate(homePathFor(user), { replace: true });
      })
      .catch((error) => setMessage(error.message));
  }, [params, navigate, signIn]);

  return (
    <main className="signin-oauth-callback" aria-live="polite">
      <img src="/educator-connect-logo.png" alt="Educator Connect" />
      <p>{message}</p>
      <Link to="/signin">Return to sign in</Link>
    </main>
  );
}
