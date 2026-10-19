import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AccountDetailsStep from '../../components/Auth/AccountDetailsStep.jsx';
import AccountTypeStep from '../../components/Auth/AccountTypeStep.jsx';
import EmailVerificationStep from '../../components/Auth/EmailVerificationStep.jsx';
import SignupSidebar from '../../components/Auth/SignupSidebar.jsx';
import '../../components/Auth/signup.css';
import { homePathFor } from '../../constants/roles.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageLoader } from '../../components/ui/index.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import {
  getPendingSocialSignup, getSocialLoginUrl, registerAccount, registerSocialAccount,
} from '../../services/authApi.js';

const TYPES = ['educator', 'centre', 'professional'];
const ROLE_FOR_TYPE = { educator: 'educator', centre: 'childcare_centre', professional: 'professional' };
const TYPE_FOR_ROLE = { educator: 'educator', childcare_centre: 'centre', professional: 'professional' };

// The pending Google/LinkedIn sign-up ({ token, provider, role, email, names, expires_at })
// survives a refresh in this tab only, and never stays in the URL.
const PENDING_KEY = 'ec.pendingSocialSignup';
const storage = {
  get: () => {
    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (!raw) return null;
      return raw.startsWith('{') ? JSON.parse(raw) : { token: raw };
    } catch {
      return null;
    }
  },
  set: (pending) => { try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending)); } catch { /* private mode */ } },
  clear: () => { try { sessionStorage.removeItem(PENDING_KEY); } catch { /* private mode */ } },
};

/** The callback hands the pending sign-up over in the URL fragment (never sent to a server). */
function pendingFromHash(hash) {
  const values = new URLSearchParams(hash.replace(/^#/, ''));
  const token = values.get('oauth');
  if (!token || token.length !== 64) return null;
  return {
    token,
    provider: values.get('provider'),
    role: values.get('role'),
    email: values.get('email'),
    name: values.get('name'),
    first_name: values.get('first_name'),
    last_name: values.get('last_name'),
    expires_at: values.get('expires_at'),
  };
}

const hasExpired = (pending) => Boolean(pending.expires_at) && Date.parse(pending.expires_at) <= Date.now();

const OAUTH_NOTICES = {
  cancelled: 'Google or LinkedIn sign-up was cancelled. Try again, or sign up with your email.',
  expired: 'Your Google or LinkedIn connection expired. Please connect again.',
  unavailable: 'Google and LinkedIn sign-up aren’t available right now. Please sign up with your email.',
  account_conflict: (
    <>That Google or LinkedIn account (or its email) already belongs to an Educator Connect account. <Link to="/signin">Sign in instead</Link>.</>
  ),
};

// Right after the OAuth redirect the API can briefly be unreachable (server restart, deploy,
// flaky mobile network). Those failures are retried before anything is shown to the person.
const RETRY_DELAYS_MS = [600, 1500, 3000];
const isTemporary = (error) => error.status === 0 || error.status === 429 || error.status >= 500;

async function withRetry(request) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      if (!isTemporary(error) || attempt >= RETRY_DELAYS_MS.length) throw error;
      await new Promise((resolve) => { setTimeout(resolve, RETRY_DELAYS_MS[attempt]); });
    }
  }
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

/** Sign up · 1 Account type → 2 Google / LinkedIn / email + details → 3 Verify email. */
export default function SignUpPage() {
  useDocumentTitle('Educator Connect — Sign up');
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, status, signIn } = useAuth();

  const requestedType = TYPES.includes(params.get('type')) ? params.get('type') : '';
  const [accountType, setAccountType] = useState(requestedType);
  const [step, setStep] = useState(requestedType ? 2 : 1);
  const [typeError, setTypeError] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [via, setVia] = useState(null); // pending provider profile + token
  const [connecting, setConnecting] = useState(false);
  const [notice, setNotice] = useState(OAUTH_NOTICES[params.get('oauth_error')] || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [registered, setRegistered] = useState(null);
  const loadedToken = useRef(false);

  const showConnected = useCallback((pending) => {
    storage.set(pending);
    setAccountType(TYPE_FOR_ROLE[pending.role] || 'educator');
    setVia(pending);
    setEmailOpen(true);
    setStep(2);
    setNotice(null);
  }, []);

  // Only for a token without its profile (links in the older ?oauth= format).
  const loadPendingSignup = useCallback(async (token, announceExpiry) => {
    setConnecting(true);
    try {
      const pending = await withRetry(() => getPendingSocialSignup(token));
      showConnected({ ...pending, token });
    } catch (error) {
      if (error.status === 422) {
        // Unknown, already used, or past its 30 minutes.
        storage.clear();
        if (announceExpiry) setNotice(OAUTH_NOTICES.expired);
      } else {
        // Still failing after the automatic retries: keep the token and offer a retry in place.
        setStep(2);
        setNotice(
          <>
            We couldn’t finish connecting your Google or LinkedIn account. {error.message}{' '}
            <button type="button" className="signup-link-btn" onClick={() => loadPendingSignup(token, true)}>Try again</button>
          </>,
        );
      }
    } finally {
      setConnecting(false);
    }
  }, [showConnected]);

  // Returning from Google/LinkedIn. The profile arrives with the redirect, so the connected
  // form shows without waiting on the API; the token and details are then cleared from the URL.
  useEffect(() => {
    if (loadedToken.current) return;
    loadedToken.current = true;

    const fromHash = pendingFromHash(location.hash);
    const legacyToken = params.get('oauth');
    if (fromHash || legacyToken || params.has('oauth_error')) {
      const next = new URLSearchParams(params);
      next.delete('oauth');
      next.delete('oauth_error');
      const search = next.toString();
      navigate({ pathname: location.pathname, search: search ? `?${search}` : '', hash: '' }, { replace: true });
    }

    const fromRedirect = Boolean(fromHash || legacyToken);
    const pending = fromHash || (legacyToken ? { token: legacyToken } : storage.get());
    if (!pending) return;

    if (hasExpired(pending)) {
      storage.clear();
      if (fromRedirect) setNotice(OAUTH_NOTICES.expired);
      return;
    }
    if (pending.email) {
      showConnected(pending);
      return;
    }
    loadPendingSignup(pending.token, fromRedirect);
  }, [params, location, navigate, showConnected, loadPendingSignup]);

  function clearVia() {
    storage.clear();
    setVia(null);
    setServerError(null);
  }

  function goBack() {
    clearVia();
    setNotice(null);
    setStep(1);
  }

  function continueToDetails() {
    if (!accountType) {
      setTypeError(true);
      return;
    }
    setStep(2);
  }

  function connect(provider) {
    clearVia();
    window.location.assign(getSocialLoginUrl(provider, 'signup', ROLE_FOR_TYPE[accountType] || 'educator'));
  }

  async function handleSubmit(details) {
    setIsSubmitting(true);
    setServerError(null);
    try {
      // Google/LinkedIn sign-ups verify their email exactly like form sign-ups (step 3).
      // The social request is safe to retry: the API returns the same account if an earlier
      // attempt got through, without sending a second verification email.
      const { user: created } = via
        ? await withRetry(() => registerSocialAccount({ ...details, token: via.token }))
        : await registerAccount(details);
      if (via) storage.clear();
      setRegistered(created);
      setStep(3);
    } catch (error) {
      if (via && error.field?.('token')) {
        clearVia();
        setNotice(error.field('token'));
      } else {
        setServerError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleVerified = useCallback((verifiedUser) => {
    signIn(verifiedUser);
    navigate(homePathFor(verifiedUser), { replace: true });
  }, [navigate, signIn]);

  if ((status === 'loading' && !registered) || connecting) return <PageLoader />;
  if (user && !registered && !isSubmitting) return <Navigate to={homePathFor(user)} replace />;

  const stepLabel = step === 1 ? 'STEP 1 OF 2 · ACCOUNT TYPE' : step === 2 ? 'STEP 2 OF 2 · YOUR DETAILS' : 'ALMOST DONE';

  return (
    <div className="signup-page">
      <SignupSidebar accountType={accountType} step={step} />

      <main className="signup-main">
        <div className="signup-topbar">
          {step === 1 && <Link className="signup-back" to="/"><BackIcon />Home</Link>}
          {step === 2 && <button type="button" className="signup-back" onClick={goBack}><BackIcon />Back</button>}
          {step === 3 && <span />}
          <span className="signup-have-account">Already have an account? <Link to="/signin">Sign in</Link></span>
        </div>

        <div className="signup-content">
          <Link to="/" className="signup-logo" aria-label="Educator Connect home">
            <img src="/educator-connect-logo.png" alt="Educator Connect" />
          </Link>

          <div className="signup-progress">
            {[1, 2].map((bar) => <span key={bar} className={bar <= Math.min(step, 2) ? 'is-on' : ''} />)}
            <strong>{stepLabel}</strong>
          </div>

          {step === 1 && (
            <AccountTypeStep
              selectedType={accountType}
              showError={typeError}
              onSelect={(type) => { setAccountType(type); setTypeError(false); }}
              onContinue={continueToDetails}
              onProfessional={() => { setAccountType('professional'); setTypeError(false); setStep(2); }}
            />
          )}

          {step === 2 && (
            <AccountDetailsStep
              key={accountType}
              accountType={accountType || 'educator'}
              via={via}
              emailOpen={emailOpen}
              notice={notice}
              isSubmitting={isSubmitting}
              serverError={serverError}
              onConnect={connect}
              onClearVia={clearVia}
              onOpenEmail={() => setEmailOpen(true)}
              onSubmit={handleSubmit}
            />
          )}

          {step === 3 && registered && (
            <EmailVerificationStep
              email={registered.email}
              accountType={accountType}
              hasPassword={registered.has_password !== false}
              onVerified={handleVerified}
            />
          )}
        </div>
      </main>
    </div>
  );
}
