import { Suspense, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { homePathFor } from '../../constants/roles.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageLoader } from '../ui/index.jsx';
import AppNav from './AppNav.jsx';

/** Scrolls to top on navigation, or to #hash targets once the page has rendered. */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  return null;
}

/** Signed-in shell: top nav + page. */
export function AppLayout() {
  return (
    <div className="ec-app">
      <AppNav />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

/**
 * Route guard. The API enforces the same rules — this only keeps people out of
 * screens they cannot use and sends them somewhere sensible.
 */
export function RequireRole({ roles }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <PageLoader label="Loading your account…" />;
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/signin?next=${next}`} replace />;
  }
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathFor(user)} replace />;
  return <Outlet />;
}

/** Sign-in / sign-up pages: signed-in users go straight to their dashboard. */
export function GuestOnly() {
  const { user, status } = useAuth();
  if (status === 'loading') return <PageLoader />;
  if (user) return <Navigate to={homePathFor(user)} replace />;
  return <Outlet />;
}
