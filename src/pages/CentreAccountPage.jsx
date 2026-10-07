import { useEffect, useState } from 'react';
import { clearAuthSession, getCurrentUser, logoutAccount } from '../services/authApi.js';
import '../components/Auth/signin.css';

export default function CentreAccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        if (currentUser.role !== 'childcare_centre') {
          window.location.replace(currentUser.role === 'educator' ? '/educator/dashboard' : '/signin');
          return;
        }
        setUser(currentUser);
      })
      .catch((requestError) => {
        if (requestError.status === 401) {
          clearAuthSession();
          window.location.replace('/signin');
          return;
        }
        setError(requestError.message);
      });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setError('');
    try {
      await logoutAccount();
      window.location.replace('/signin');
    } catch (requestError) {
      setError(requestError.message);
      setLoggingOut(false);
    }
  }

  return (
    <main className="signin-oauth-callback">
      <img src="/educator-connect-logo.png" alt="Educator Connect" />
      {user ? (
        <>
          <h1>Welcome, {user.name}</h1>
          <p>Your childcare-centre account is ready. The centre workspace is the next dashboard being built.</p>
          <button className="signin-submit" type="button" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </>
      ) : error ? (
        <>
          <p role="alert">{error}</p>
          <a href="/signin">Return to sign in</a>
        </>
      ) : <p>Loading your centre account…</p>}
    </main>
  );
}
