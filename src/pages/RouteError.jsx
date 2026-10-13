import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

/** Last-resort boundary for render errors and failed lazy chunks (e.g. after a deploy). */
export default function RouteError() {
  const error = useRouteError();
  const chunkFailed = /Failed to fetch dynamically imported module|Importing a module script failed/i.test(String(error?.message || ''));

  return (
    <main className="ec-app">
      <div className="ec-page-state">
        <div className="ec-state">
          <img src="/educator-connect-logo.png" alt="Educator Connect" style={{ height: 38 }} />
          <strong>{chunkFailed ? 'A new version of Educator Connect is available' : 'Something went wrong'}</strong>
          <span>
            {chunkFailed
              ? 'Refresh the page to load the latest version.'
              : isRouteErrorResponse(error) ? error.statusText : 'Please refresh the page. If this keeps happening, contact support.'}
          </span>
          <div className="ec-actions">
            <button type="button" className="ec-btn ec-btn-primary" onClick={() => window.location.reload()}>Refresh</button>
            <Link className="ec-btn ec-btn-secondary" to="/">Go home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
