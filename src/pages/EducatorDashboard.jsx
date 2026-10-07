import { useEffect, useState } from 'react';
import DashboardHeader from '../components/EducatorDashboard/DashboardHeader.jsx';
import ProfileSetupCard from '../components/EducatorDashboard/ProfileSetupCard.jsx';
import DashboardStats from '../components/EducatorDashboard/DashboardStats.jsx';
import ApplicationsPanel from '../components/EducatorDashboard/ApplicationsPanel.jsx';
import RecommendedJobs from '../components/EducatorDashboard/RecommendedJobs.jsx';
import DashboardSidebar from '../components/EducatorDashboard/DashboardSidebar.jsx';
import DashboardIcon from '../components/EducatorDashboard/DashboardIcon.jsx';
import { dashboardData } from '../components/EducatorDashboard/dashboardData.js';
import { clearAuthSession, getCurrentUser, logoutAccount } from '../services/authApi.js';
import '../components/EducatorDashboard/educator-dashboard.css';

export default function EducatorDashboard() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(true);
  const [practicumMode, setPracticumMode] = useState(false);
  const [savedJobs, setSavedJobs] = useState(dashboardData.initialSavedJobs);
  const [previewMessage, setPreviewMessage] = useState('');

  const savedJobsCount =
    dashboardData.savedJobsBeforeRecommendations +
    Object.values(savedJobs).filter(Boolean).length;

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((currentUser) => {
        if (!active) return;
        if (currentUser.role !== 'educator') {
          window.location.replace(currentUser.role === 'childcare_centre' ? '/centre/dashboard' : '/signin');
          return;
        }
        setUser(currentUser);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) {
          clearAuthSession();
          window.location.replace('/signin');
          return;
        }
        setAuthError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setAuthError('');
    try {
      await logoutAccount();
      window.location.replace('/signin');
    } catch (error) {
      setAuthError(error.message);
      setLoggingOut(false);
    }
  }

  function showLocalPreviewMessage(message) {
    setPreviewMessage(message);
  }

  function toggleSavedJob(jobId) {
    setSavedJobs((current) => ({
      ...current,
      [jobId]: !current[jobId],
    }));
  }

  if (loading) {
    return (
      <main className="dashboard-auth-state" aria-live="polite">
        <p>Loading your educator dashboard…</p>
      </main>
    );
  }

  if (authError && !user) {
    return (
      <main className="dashboard-auth-state" role="alert">
        <p>{authError}</p>
        <a href="/signin">Return to sign in</a>
      </main>
    );
  }

  if (!user) return null;

  const firstName = user.educator_profile?.first_name || user.name?.trim().split(/\s+/)[0] || 'Educator';

  return (
    <div className="educator-dashboard">
      <DashboardHeader user={user} onLogout={handleLogout} loggingOut={loggingOut} onPreviewAction={showLocalPreviewMessage} />

      <main className="dashboard-main" id="dashboard">
        <div className="dashboard-preview-label">
          <span className="dashboard-preview-dot" aria-hidden="true" />
          Signed in · activity, job and metric data are illustrative
        </div>

        {previewMessage && (
          <p className="dashboard-feedback" role="status">
            {previewMessage}
          </p>
        )}
        {authError && <p className="dashboard-feedback" role="alert">{authError}</p>}

        <section className="dashboard-greeting" aria-labelledby="dashboard-title">
          <div className="dashboard-greeting-copy">
            <h1 id="dashboard-title">Good morning, {firstName}</h1>
            <p>Here’s where your job search stands today.</p>
          </div>
          <div className="dashboard-greeting-actions">
            <button
              className="dashboard-button dashboard-button-secondary"
              type="button"
              onClick={() =>
                showLocalPreviewMessage(
                  'Profile editing is not connected in this local preview.',
                )
              }
            >
              View my profile
            </button>
            <a
              className="dashboard-button dashboard-button-primary"
              href="#recommended-jobs"
            >
              <DashboardIcon name="search" size={16} />
              Find jobs
            </a>
          </div>
        </section>

        {showProfileSetup && (
          <ProfileSetupCard
            items={dashboardData.profileSetupItems}
            onDismiss={() => setShowProfileSetup(false)}
            onPreviewAction={showLocalPreviewMessage}
          />
        )}

        <DashboardStats savedJobsCount={savedJobsCount} />

        <div className="dashboard-content-grid">
          <div className="dashboard-main-column">
            <ApplicationsPanel applications={dashboardData.applications} />
            <RecommendedJobs
              jobs={dashboardData.recommendedJobs}
              savedJobs={savedJobs}
              onToggleSaved={toggleSavedJob}
              onPreviewAction={showLocalPreviewMessage}
            />
          </div>

          <DashboardSidebar
            practicumMode={practicumMode}
            onPracticumModeChange={setPracticumMode}
            onPreviewAction={showLocalPreviewMessage}
          />
        </div>

        <p className="dashboard-data-note">
          Your account identity is live. Application history, profile completion,
          recommendations, activity and statistics are sample data until their
          dashboard endpoints are connected.
        </p>
      </main>
    </div>
  );
}
