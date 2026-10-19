import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onUnauthorized } from '../lib/api.js';
import { getCurrentUser, logoutAccount } from '../services/authApi.js';

const AuthContext = createContext(null);

/**
 * Holds the signed-in user. The session itself lives in Laravel's HTTP-only cookie;
 * this context only mirrors /auth/me so the UI knows who is signed in.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | guest

  const refresh = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
      setStatus('authenticated');
      return current;
    } catch {
      setUser(null);
      setStatus('guest');
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
    onUnauthorized(() => {
      setUser(null);
      setStatus('guest');
    });
  }, [refresh]);

  // The verification link is usually opened in another tab. When an unverified user comes
  // back, re-check so publish actions unlock without a manual reload.
  const awaitingVerification = Boolean(user) && !user.email_verified;
  useEffect(() => {
    if (!awaitingVerification) return undefined;
    const recheck = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('focus', recheck);
    document.addEventListener('visibilitychange', recheck);
    return () => {
      window.removeEventListener('focus', recheck);
      document.removeEventListener('visibilitychange', recheck);
    };
  }, [awaitingVerification, refresh]);

  const signIn = useCallback((nextUser) => {
    setUser(nextUser);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutAccount();
    } finally {
      setUser(null);
      setStatus('guest');
    }
  }, []);

  const value = useMemo(() => ({ user, status, refresh, signIn, signOut, setUser }), [user, status, refresh, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>.');
  return context;
}
