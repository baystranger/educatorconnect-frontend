import { useEffect, useState } from 'react';
import { registerAccount } from '../../services/authApi.js';
import AccountDetailsStep from './AccountDetailsStep.jsx';
import AccountTypeStep from './AccountTypeStep.jsx';
import SignupSidebar from './SignupSidebar.jsx';
import './signup.css';

export default function Signup() {
  const requestedType = new URLSearchParams(window.location.search).get('type');
  const [accountType, setAccountType] = useState(
    requestedType === 'educator' || requestedType === 'centre' ? requestedType : '',
  );
  const [step, setStep] = useState('account-type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Educator Connect — Sign up';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  async function handleComplete(accountDetails) {
    setIsSubmitting(true);
    setServerError('');
    try {
      const { user } = await registerAccount(accountDetails);
      window.location.assign(user.role === 'educator' ? '/educator/dashboard' : '/centre/dashboard');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`signup-page signup-page-${step} min-h-screen w-full`}>
      <SignupSidebar accountType={accountType} step={step} />
      <main className="signup-main flex min-h-screen w-full flex-col">
        <div className="signup-topbar flex w-full items-center justify-between">
          {step === 'account-type' ? (
            <a className="signup-home-link" href="/"><span aria-hidden="true">‹</span> Home</a>
          ) : (
            <button className="signup-home-link" type="button" onClick={() => setStep('account-type')}>
              <span aria-hidden="true">‹</span> Back
            </button>
          )}
          <span className="signup-signin-prompt">Already have an account? <a href="/signin">Sign in</a></span>
        </div>
        <div className="signup-content">
          <a className="signup-logo" href="/" aria-label="Educator Connect home">
            <img src="/educator-connect-logo.png" alt="Educator Connect" />
          </a>
          {step === 'account-type' && (
            <AccountTypeStep
              selectedType={accountType}
              onSelect={setAccountType}
              onContinue={() => setStep('details')}
            />
          )}
          {step === 'details' && (
            <AccountDetailsStep
              accountType={accountType}
              onBack={() => setStep('account-type')}
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
              serverError={serverError}
            />
          )}
        </div>
      </main>
    </div>
  );
}
