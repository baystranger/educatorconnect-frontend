import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, EmptyState, ErrorState, FilterPills, Icon, Modal, Pill, Skeleton } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { deleteJob, getCentreJobs, jobAction } from '../../services/centreApi.js';
import { formatShortDate, plural, STATUS_TONES } from '../../utils/format.js';
import './centre.css';

const TABS = [['active', 'All active'], ['published', 'Published'], ['draft', 'Drafts'], ['closed', 'Closed'], ['archived', 'Archived']];
const STATUS_LABEL = { published: 'Published', draft: 'Draft', closed: 'Closed', archived: 'Archived' };

function RowMenu({ job, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const items = [
    ['edit', 'Edit posting'],
    job.status !== 'published' && job.status !== 'draft' && ['publish', 'Reopen posting'],
    job.status === 'published' && ['view', 'View public posting'],
    job.status === 'published' && ['close', 'Close posting'],
    job.status !== 'archived' && job.status !== 'draft' && ['archive', 'Archive'],
    ['duplicate', 'Duplicate'],
    job.status === 'draft' && job.applicants_count === 0 && ['delete', 'Delete draft'],
  ].filter(Boolean);

  return (
    <span ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="ec-btn ec-btn-icon" aria-label={`More actions for ${job.title}`} aria-expanded={open ? 'true' : 'false'} onClick={() => setOpen(!open)}>
        <Icon name="more" size={18} />
      </button>
      {open && (
        <span className="jp-menu" role="menu">
          {items.map(([key, label]) => (
            <button key={key} type="button" role="menuitem" className={key === 'delete' ? 'is-danger' : ''} onClick={() => { setOpen(false); onAction(key, job); }}>{label}</button>
          ))}
        </span>
      )}
    </span>
  );
}

export default function JobPostingsPage() {
  useDocumentTitle('Job postings');
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some(([key]) => key === params.get('tab')) ? params.get('tab') : 'active';
  const [search, setSearch] = useState(params.get('search') || '');
  const [query, setQuery] = useState(search);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { data: jobs, meta, loading, error, reload } = useResource((signal) => getCentreJobs({ tab, search: query }, { signal }), [tab, query]);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function handleAction(action, job) {
    if (action === 'edit') return navigate(`/centre/jobs/${job.id}/edit`);
    if (action === 'view') return navigate(`/jobs/${job.slug}`);
    if (action === 'delete') return setConfirmDelete(job);
    try {
      const response = await jobAction(job.id, action);
      toast.success(response.message);
      if (action === 'duplicate') navigate(`/centre/jobs/${response.data.id}/edit`);
      else reload({ silent: true });
    } catch (requestError) {
      toast.error(requestError.field('publish') || requestError.message);
    }
    return undefined;
  }

  async function remove() {
    try {
      await deleteJob(confirmDelete.id);
      toast.success('Draft deleted.');
      setConfirmDelete(null);
      reload({ silent: true });
    } catch (requestError) {
      toast.error(requestError.field('job') || requestError.message);
    }
  }

  return (
    <main className="ec-main">
      <div className="ec-container ec-stack" style={{ gap: 22 }}>
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">Job postings</h1>
            <p className="ec-sub">Create, publish and manage your roles and practicum placements.</p>
          </div>
          <div className="ec-actions"><Button to="/centre/jobs/new"><Icon name="plus" size={16} strokeWidth={2.6} />Post a job</Button></div>
        </div>

        <div className="jp-toolbar">
          <FilterPills label="Filter postings" value={tab} onChange={(key) => setParams(key === 'active' ? {} : { tab: key }, { replace: true })}
            options={TABS.map(([key, label]) => ({ key, label, count: meta?.counts?.[key] ?? undefined }))} />
          <label className="jp-search">
            <Icon name="search" size={17} />
            <input type="search" placeholder="Search postings" aria-label="Search postings" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
        </div>

        <section className="ec-card" style={{ overflow: 'visible' }}>
          <div className="ec-table-head jp-head" style={{ borderRadius: '20px 20px 0 0' }}><span>Role</span><span>Status</span><span>Applicants</span><span>Views</span><span>Dates</span><span style={{ textAlign: 'right' }}>Actions</span></div>
          {loading && !jobs && [0, 1, 2].map((key) => <div className="ec-row" key={key}><Skeleton height={44} /></div>)}
          {error && <ErrorState error={error} onRetry={reload} />}
          {!error && jobs?.length === 0 && (
            <EmptyState title={query ? 'No postings match your search' : tab === 'active' ? 'No job postings yet' : `No ${TABS.find(([key]) => key === tab)[1].toLowerCase()} postings`}
              action={tab === 'active' && !query ? <Button size="sm" to="/centre/jobs/new">Post your first job</Button> : null}>
              {tab === 'active' && !query ? 'Post full-time, part-time, casual, substitute or practicum roles.' : null}
            </EmptyState>
          )}
          {!error && jobs?.map((job) => (
            <div key={job.id} className="ec-row jp-row" style={{ cursor: 'default' }}>
              <span className="jp-role">
                <span className={`jp-role-icon ${job.status === 'draft' || job.status === 'archived' ? 'is-muted' : ''}`}><Icon name="briefcase" size={18} /></span>
                <span><strong>{job.title}</strong><small>{[job.employment_type?.label, job.number_of_positions && plural(job.number_of_positions, job.employment_type?.key === 'practicum' ? 'placement' : 'position')].filter(Boolean).join(' · ')}</small></span>
              </span>
              <span><Pill tone={STATUS_TONES[job.status]}>{STATUS_LABEL[job.status]}</Pill></span>
              <span className="jp-count">{job.status === 'draft' ? '—' : job.applicants_count}{job.new_applicants_count > 0 && <small>+{job.new_applicants_count} new</small>}</span>
              <span className="cd-cell">{job.status === 'draft' ? '—' : job.views}</span>
              <span className="jp-dates">
                {job.status === 'draft' ? <span className="ec-muted">Not published</span> : (
                  <>
                    {job.published_at && <span>Posted {formatShortDate(job.published_at)}</span>}
                    <span>{job.status === 'closed' || job.status === 'archived' ? `Closed ${formatShortDate(job.closed_at || job.application_deadline)}` : job.application_deadline ? `Closes ${formatShortDate(job.application_deadline)}` : 'Open until filled'}</span>
                  </>
                )}
              </span>
              <span className="jp-actions">
                {job.status === 'draft'
                  ? <Button size="xs" to={`/centre/jobs/${job.id}/edit`}>Finish draft</Button>
                  : <Button size="xs" variant="soft" to={`/centre/applicants?job=${job.id}`}>Applicants</Button>}
                <RowMenu job={job} onAction={handleAction} />
              </span>
            </div>
          ))}
        </section>
        <p className="ec-muted" style={{ margin: 0, fontSize: 13.5 }}>Drafts are only visible to you. Closed postings stop accepting applications but keep their applicants. Archived postings are hidden from this list.</p>
      </div>

      <Modal open={Boolean(confirmDelete)} title="Delete this draft?" onClose={() => setConfirmDelete(null)}
        footer={<><Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button variant="danger-solid" onClick={remove}>Delete draft</Button></>}>
        <p className="ec-muted" style={{ margin: 0 }}>“{confirmDelete?.title}” will be permanently removed.</p>
      </Modal>
    </main>
  );
}
