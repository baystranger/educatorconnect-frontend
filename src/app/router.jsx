import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppLayout, GuestOnly, RequireRole, ScrollManager } from '../components/layout/Layouts.jsx';
import { PageLoader } from '../components/ui/index.jsx';
import { ROLES } from '../constants/roles.js';
import { UnsavedChangesProvider } from '../context/UnsavedChangesContext.jsx';
import RouteError from '../pages/RouteError.jsx';

// Public
const HomePage = lazy(() => import('../pages/public/HomePage.jsx'));
const ChildcareSearchPage = lazy(() => import('../pages/public/ChildcareSearchPage.jsx'));
const CentrePublicPage = lazy(() => import('../pages/public/CentrePublicPage.jsx'));
const PublicJobsPage = lazy(() => import('../pages/public/PublicJobsPage.jsx'));
const EducatorPublicPage = lazy(() => import('../pages/public/EducatorPublicPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

// Auth
const SignInPage = lazy(() => import('../pages/auth/SignInPage.jsx'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage.jsx'));
const OAuthCallbackPage = lazy(() => import('../pages/auth/OAuthCallbackPage.jsx'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage.jsx'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage.jsx'));

// Educator
const EducatorDashboardPage = lazy(() => import('../pages/educator/EducatorDashboardPage.jsx'));
const FindJobsPage = lazy(() => import('../pages/educator/FindJobsPage.jsx'));
const MyJobsPage = lazy(() => import('../pages/educator/MyJobsPage.jsx'));
const EducatorProfilePage = lazy(() => import('../pages/educator/EducatorProfilePage.jsx'));

// Centre
const CentreDashboardPage = lazy(() => import('../pages/centre/CentreDashboardPage.jsx'));
const JobPostingsPage = lazy(() => import('../pages/centre/JobPostingsPage.jsx'));
const PostJobPage = lazy(() => import('../pages/centre/PostJobPage.jsx'));
const ApplicantsPage = lazy(() => import('../pages/centre/ApplicantsPage.jsx'));
const FamiliesPage = lazy(() => import('../pages/centre/FamiliesPage.jsx'));
const CentreProfileBuilderPage = lazy(() => import('../pages/centre/CentreProfileBuilderPage.jsx'));

// Professional
const ProfessionalDashboardPage = lazy(() => import('../pages/professional/ProfessionalDashboardPage.jsx'));
const ListingEditorPage = lazy(() => import('../pages/professional/ListingEditorPage.jsx'));

// Administrator
const AdminConsolePage = lazy(() => import('../pages/admin/AdminConsolePage.jsx'));

// Any signed-in account
const SettingsPage = lazy(() => import('../pages/account/SettingsPage.jsx'));

function Root() {
  return (
    <UnsavedChangesProvider>
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </UnsavedChangesProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/childcare', element: <ChildcareSearchPage /> },
      { path: '/childcare-search', element: <Navigate to="/childcare" replace /> },
      { path: '/childcare/:slug', element: <CentrePublicPage /> },
      { path: '/jobs', element: <PublicJobsPage /> },
      { path: '/jobs/:slug', element: <PublicJobsPage /> },
      { path: '/educators/:slug', element: <EducatorPublicPage /> },
      { path: '/auth/callback', element: <OAuthCallbackPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      // Sign-up manages its own redirect: the account is signed in before email verification.
      { path: '/signup', element: <SignUpPage /> },

      {
        element: <GuestOnly />,
        children: [
          { path: '/signin', element: <SignInPage /> },
        ],
      },

      {
        element: <RequireRole roles={[ROLES.EDUCATOR]} />,
        children: [{
          path: '/educator',
          element: <AppLayout />,
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: 'dashboard', element: <EducatorDashboardPage /> },
            { path: 'jobs', element: <FindJobsPage /> },
            { path: 'my-jobs', element: <MyJobsPage /> },
            { path: 'profile', element: <EducatorProfilePage /> },
          ],
        }],
      },

      {
        element: <RequireRole roles={[ROLES.CENTRE]} />,
        children: [{
          path: '/centre',
          element: <AppLayout />,
          children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: 'dashboard', element: <CentreDashboardPage /> },
            { path: 'jobs', element: <JobPostingsPage /> },
            { path: 'jobs/new', element: <PostJobPage /> },
            { path: 'jobs/:jobId/edit', element: <PostJobPage /> },
            { path: 'applicants', element: <ApplicantsPage /> },
            { path: 'families', element: <FamiliesPage /> },
            { path: 'profile', element: <Navigate to="basics" replace /> },
            { path: 'profile/:step', element: <CentreProfileBuilderPage /> },
          ],
        }],
      },

      {
        element: <RequireRole roles={[ROLES.PROFESSIONAL]} />,
        children: [{
          path: '/professional',
          element: <AppLayout />,
          children: [
            { index: true, element: <ProfessionalDashboardPage /> },
            { path: 'listings/new', element: <ListingEditorPage /> },
            { path: 'listings/:listingId/edit', element: <ListingEditorPage /> },
          ],
        }],
      },

      {
        element: <RequireRole roles={[ROLES.ADMINISTRATOR]} />,
        children: [{ path: '/admin', element: <AppLayout />, children: [{ index: true, element: <AdminConsolePage /> }] }],
      },

      {
        element: <RequireRole roles={Object.values(ROLES)} />,
        children: [{ element: <AppLayout />, children: [{ path: '/settings', element: <SettingsPage /> }] }],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
