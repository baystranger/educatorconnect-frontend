import { useEffect, useState } from 'react';
import { registerAccount } from '../../services/authApi.js';

import AccountDetailsStep from './AccountDetailsStep.jsx';
import AccountTypeStep from './AccountTypeStep.jsx';
import SignupSidebar from './SignupSidebar.jsx';
import EmailVerificationStep from './EmailVerificationStep.jsx';

import './signup.css';


const BYPASS_EMAIL_VERIFICATION = import.meta.env.VITE_BYPASS_EMAIL_VERIFICATION === 'true';

export default function Signup() {
  const requestedType = new URLSearchParams(window.location.search).get('type');

  const [accountType, setAccountType] = useState(
    requestedType === 'educator' || requestedType === 'centre'
      ? requestedType
      : '',
  );

  const [step, setStep] = useState('account-type');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // ============================================================
  // EMAIL VERIFICATION STATE
  // ============================================================

  // Email returned/submitted during registration.
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Registered user returned from Laravel.
  const [registeredUser, setRegisteredUser] = useState(null);

  useEffect(() => {
    const previousTitle = document.title;

    document.title = 'Educator Connect — Sign up';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  // ============================================================
  // STEP 2 -> REGISTRATION
  // ============================================================

  async function handleComplete(accountDetails) {
    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await registerAccount(accountDetails);

      const user = response?.user;

      if (!user) {
        throw new Error('Registration succeeded but no user was returned.');
      }

      // Save the registered user.
      setRegisteredUser(user);

      // Save email for Step 3.
      setRegisteredEmail(user.email || accountDetails.email);

      // ========================================================
      // DEMO BYPASS
      // ========================================================
      //
      // TEMPORARY ONLY.
      //
      // If BYPASS_EMAIL_VERIFICATION is TRUE, we skip Step 3
      // and send the user directly to the dashboard.
      //
      // Set this to FALSE when you want real verification.
      //
      // ========================================================

      if (BYPASS_EMAIL_VERIFICATION) {
        console.warn(
          'DEMO MODE: Email verification is being bypassed.',
        );

        redirectToDashboard(user);
        return;
      }

      // ========================================================
      // PRODUCTION FLOW
      // ========================================================
      //
      // Registration succeeded.
      // Now show Step 3 instead of going to dashboard.
      //
      setStep('verification');
    } catch (error) {
      setServerError(
        error?.message ||
          'Unable to create your account. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ============================================================
  // STEP 3 -> EMAIL VERIFIED
  // ============================================================

  function handleEmailVerified(user = registeredUser) {
    if (!user) {
      console.error('No user available after email verification.');
      return;
    }

    redirectToDashboard(user);
  }

  // ============================================================
  // DASHBOARD REDIRECT
  // ============================================================

  function redirectToDashboard(user) {
    if (user.role === 'educator') {
      window.location.assign('/educator/dashboard');
      return;
    }

    // Childcare centre role.
    window.location.assign('/centre/dashboard');
  }

  return (
    <div
      className={`signup-page signup-page-${step} min-h-screen w-full`}
    >
      <SignupSidebar
        accountType={accountType}
        step={step}
      />

      <main className="signup-main flex min-h-screen w-full flex-col">

        {/* ======================================================
            TOP BAR
        ====================================================== */}

        <div className="signup-topbar flex w-full items-center justify-between">

          {step === 'account-type' ? (
            <a
              className="signup-home-link"
              href="/"
            >
              <span aria-hidden="true">‹</span>
              Home
            </a>
          ) : (
            <button
              className="signup-home-link"
              type="button"
              onClick={() => {
                if (step === 'verification') {
                  setStep('details');
                } else {
                  setStep('account-type');
                }
              }}
            >
              <span aria-hidden="true">‹</span>
              Back
            </button>
          )}

          <span className="signup-signin-prompt">
            Already have an account?{' '}
            <a href="/signin">Sign in</a>
          </span>
        </div>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <div className="signup-content">

          <a
            className="signup-logo"
            href="/"
            aria-label="Educator Connect home"
          >
            <img
              src="/educator-connect-logo.png"
              alt="Educator Connect"
            />
          </a>

          {/* ====================================================
              STEP 1
          ==================================================== */}

          {step === 'account-type' && (
            <AccountTypeStep
              selectedType={accountType}
              onSelect={setAccountType}
              onContinue={() => setStep('details')}
            />
          )}

          {/* ====================================================
              STEP 2
          ==================================================== */}

          {step === 'details' && (
            <AccountDetailsStep
              accountType={accountType}
              onBack={() => setStep('account-type')}
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
              serverError={serverError}
            />
          )}

          {/* ====================================================
              STEP 3
          ==================================================== */}

          {step === 'verification' && (
            <EmailVerificationStep
              email={registeredEmail}
              accountType={accountType}
              onBack={() => setStep('details')}
              onVerified={handleEmailVerified}
            />
          )}

        </div>
      </main>
    </div>
  );
}