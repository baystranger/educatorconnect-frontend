import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import JobSearchView from '../../components/jobs/JobSearchView.jsx';
import { PageLoader } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

/** Public job board. Signed-in educators are sent to the same view inside their workspace. */
export default function PublicJobsPage() {
  useDocumentTitle('ECE jobs near you');
  const { slug } = useParams();
  const [params] = useSearchParams();
  const { user, status } = useAuth();

  if (status === 'loading') return <PageLoader />;
  if (user?.role === 'educator') {
    const next = new URLSearchParams(params);
    if (slug) next.set('job', slug);
    return <Navigate to={`/educator/jobs?${next}`} replace />;
  }
  if (slug && !params.get('job')) {
    const next = new URLSearchParams(params);
    next.set('job', slug);
    return <Navigate to={`/jobs?${next}`} replace />;
  }

  return (
    <div className="ec-app">
      <Header />
      <JobSearchView />
    </div>
  );
}
