import { useCallback, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AccountDetailsStep from '../../components/Auth/AccountDetailsStep.jsx';
import AccountTypeStep from '../../components/Auth/AccountTypeStep.jsx';
import EmailVerificationStep from '../../components/Auth/EmailVerificationStep.jsx';
import SignupSidebar from '../../components/Auth/SignupSidebar.jsx';
import '../../components/Auth/signup.css';
import { homePathFor } from '../../constants/roles.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageLoader } from '../../components/ui/index.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { registerAccount } from '../../services/authApi.js';

/** Sign up · 1 Account type → 2 Details → 3 Verify email. */
export default function SignUpPage() {
  useDocumentTitle('Educator Connect — Sign up');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, status, signIn } = useAuth();
  const requestedType = params.get('type');

  const knownType = ['educator', 'centre', 'professional'].includes(requestedType);
  const [accountType, setAccountType] = useState(knownType ? requestedType : '');
  const [step, setStep] = useState(knownType ? 'details' : 'account-type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [registered, setRegistered] = useState(null);

  async function handleComplete(details) {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const { user } = await registerAccount(details);
      setRegistered(user);
      setStep('verification');
    } catch (error) {
      setServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleVerified = useCallback((user) => {
    signIn(user);
    navigate(homePathFor(user), { replace: true });
  }, [navigate, signIn]);

  if (status === 'loading' && !registered) return <PageLoader />;
  if (user && !registered) return <Navigate to={homePathFor(user)} replace />;

  return (
    <div className={`signup-page signup-page-${step} min-h-screen w-full`}>
      <SignupSidebar accountType={accountType} step={step} />
      <main className="signup-main flex min-h-screen w-full flex-col">
        <div className="signup-topbar flex w-full items-center justify-between">
          {step === 'account-type' ? (
            <Link className="signup-home-link" to="/"><span aria-hidden="true">‹</span> Home</Link>
          ) : step === 'details' ? (
            <button className="signup-home-link" type="button" onClick={() => setStep('account-type')}>
              <span aria-hidden="true">‹</span> Back
            </button>
          ) : (
            <span />
          )}
          <span className="signup-signin-prompt">Already have an account? <Link to="/signin">Sign in</Link></span>
        </div>
        <div className="signup-content">
          <Link className="signup-logo" to="/" aria-label="Educator Connect home">
            <img src="/educator-connect-logo.png" alt="Educator Connect" />
          </Link>
          {step === 'account-type' && (
            <AccountTypeStep selectedType={accountType} onSelect={setAccountType} onContinue={() => setStep('details')} />
          )}
          {step === 'details' && (
            <AccountDetailsStep
              accountType={accountType || 'educator'}
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
              serverError={serverError}
            />
          )}
          {step === 'verification' && registered && (
            <EmailVerificationStep email={registered.email} accountType={accountType} onVerified={handleVerified} />
          )}
        </div>
      </main>
    </div>
  );
}
