import { useEffect, useState } from 'react';
import { exchangeOAuthCode } from '../../services/authApi.js';
import './signin.css';

export default function OAuthCallback() {
  const [message, setMessage] = useState('Finishing your secure sign-in…');

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
      setMessage('This sign-in link is missing its temporary code. Please try again.');
      return;
    }

    exchangeOAuthCode(code)
      .then(({ user }) => {
        window.location.replace(user.role === 'educator' ? '/educator/dashboard' : '/centre/dashboard');
      })
      .catch((error) => {
        setMessage(error.message);
      });
  }, []);

  return (
    <main className="signin-oauth-callback" aria-live="polite">
      <img src="/educator-connect-logo.png" alt="Educator Connect" />
      <p>{message}</p>
      <a href="/signin">Return to sign in</a>
    </main>
  );
}
