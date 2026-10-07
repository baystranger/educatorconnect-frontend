import { useEffect, useState } from 'react';

export default function EmailVerificationStep({
  email,
  accountType,
  onBack,
  onVerified,
}) {
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // ============================================================
  // CHECK EMAIL VERIFICATION STATUS
  // ============================================================

  async function checkVerificationStatus() {
    setIsChecking(true);

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      const response = await fetch('/api/auth/email-verification-status', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            'Unable to check verification status.',
        );
      }

      if (data.email_verified === true) {
        onVerified(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  }

  // ============================================================
  // POLL EVERY 5 SECONDS
  // ============================================================

  useEffect(() => {
    // Check immediately.
    checkVerificationStatus();

    // Then check every 5 seconds.
    const interval = setInterval(() => {
      checkVerificationStatus();
    }, 5000);

    // Cleanup when component is removed.
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // RESEND EMAIL
  // ============================================================

  async function resendVerificationEmail() {
    setIsResending(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(
        '/api/auth/email/verification-notification',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            'Unable to resend verification email.',
        );
      }

      setMessage(
        'Verification email sent. Please check your inbox.',
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="signup-verification-step">

      <div className="signup-step-indicator">
        <span className="signup-step-line active" />
        <span className="signup-step-line active" />
        <span className="signup-step-line active" />

        <span>
          STEP 3 OF 3 · EMAIL VERIFICATION
        </span>
      </div>

      <div className="signup-intro">
        <h1>Check your email</h1>

        <p>
          We sent a verification link to:
        </p>

        <strong>
          {email}
        </strong>

        <p>
          Click the link in the email to activate your
          {accountType === 'centre'
            ? ' childcare centre'
            : ' educator'}{' '}
          account.
        </p>
      </div>

      {/* Checking status */}

      {isChecking && (
        <p className="signup-verification-status">
          Checking verification status...
        </p>
      )}

      {/* Success message */}

      {message && (
        <div className="signup-success-message">
          {message}
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="signup-error-message">
          {error}
        </div>
      )}

      {/* Actions */}

      <div className="signup-verification-actions">

        <button
          className="signup-primary-button"
          type="button"
          onClick={checkVerificationStatus}
          disabled={isChecking}
        >
          {isChecking
            ? 'Checking...'
            : 'I have verified my email'}
        </button>

        <button
          className="signup-secondary-button"
          type="button"
          onClick={resendVerificationEmail}
          disabled={isResending}
        >
          {isResending
            ? 'Sending...'
            : 'Resend verification email'}
        </button>

        <button
          className="signup-secondary-button"
          type="button"
          onClick={onBack}
        >
          Change details
        </button>

      </div>

    </div>
  );
}