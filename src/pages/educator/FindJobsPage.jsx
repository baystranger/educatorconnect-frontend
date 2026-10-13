import JobSearchView from '../../components/jobs/JobSearchView.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function FindJobsPage() {
  useDocumentTitle('Find jobs');
  return <JobSearchView />;
}
