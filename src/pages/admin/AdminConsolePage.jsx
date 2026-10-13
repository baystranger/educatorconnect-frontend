import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Avatar, Button, EmptyState, ErrorState, Field, FilterPills, Input, Modal, Pill, Skeleton, Tabs, Textarea } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import {
  downloadClaimDocument, getAdminCentres, getAdminClaims, getAdminCredentials, getAdminListings, getModerationOverview,
  moderateCentre, moderateClaim, moderateListing, setCredentialStatus,
} from '../../services/adminApi.js';
import { formatShortDate } from '../../utils/format.js';
import './admin.css';

const QUEUES = {
  listings: {
    label: 'Directory listings', countKey: 'listings_pending', load: getAdminListings,
    statuses: [['pending_review', 'Waiting'], ['claimed_verified', 'Live'], ['rejected', 'Sent back']],
  },
  claims: {
    label: 'Listing claims', countKey: 'claims_pending', load: getAdminClaims,
    statuses: [['pending', 'Waiting'], ['approved', 'Approved'], ['rejected', 'Rejected']],
  },
  credentials: {
    label: 'Educator credentials', countKey: 'credentials_pending', load: getAdminCredentials,
    statuses: [['pending', 'Waiting'], ['verified', 'Verified'], ['rejected', 'Rejected']],
  },
  centres: {
    label: 'Centres', countKey: 'centres_pending', load: getAdminCentres,
    statuses: [['pending_review', 'Waiting'], ['published', 'Published'], ['suspended', 'Suspended'], ['draft', 'Draft']],
  },
};

const STATUS_TONES = {
  pending_review: 'yellow', pending: 'yellow', claimed_verified: 'green', approved: 'green', verified: 'green', published: 'green',
  rejected: 'danger', suspended: 'danger', draft: 'gray',
};
const label = (status) => { const text = status.replace('claimed_verified', 'live').replace('_', ' '); return text[0].toUpperCase() + text.slice(1); };

/** Asks for a reason before a rejection the owner will see. */
function ReasonModal({ request, onClose, onConfirm }) {
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  if (!request) return null;
  return (
    <Modal open title={request.title} onClose={onClose}
      footer={(
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger-solid" loading={busy} disabled={request.required && !notes.trim()}
            onClick={async () => { setBusy(true); await onConfirm(notes.trim()); setBusy(false); }}>{request.confirm}</Button>
        </>
      )}>
      <Field label={request.required ? 'What needs to change?' : 'Note for the applicant (optional)'}>
        <Textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} />
      </Field>
    </Modal>
  );
}

function Row({ avatar, title, meta, children, status }) {
  return (
    <div className="ec-row ad-row">
      <Avatar name={avatar} initials={avatar.slice(0, 2).toUpperCase()} size={40} />
      <span className="ad-copy">
        <span className="ec-row-flex ec-wrap" style={{ gap: 8 }}><strong>{title}</strong>{status && <Pill size="sm" tone={STATUS_TONES[status] || 'gray'}>{label(status)}</Pill>}</span>
        {meta}
      </span>
      <span className="ec-actions ad-actions">{children}</span>
    </div>
  );
}

export default function AdminConsolePage() {
  useDocumentTitle('Moderation');
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = QUEUES[params.get('tab')] ? params.get('tab') : 'listings';
  const queue = QUEUES[tab];
  const status = queue.statuses.some(([key]) => key === params.get('status')) ? params.get('status') : queue.statuses[0][0];
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(null);
  const [reason, setReason] = useState(null);

  const { data: overview, reload: reloadOverview } = useResource((signal) => getModerationOverview({ signal }), []);
  const { data: items, meta, loading, error, reload } = useResource(
    (signal) => (tab === 'centres' ? queue.load(status, query, { signal }) : queue.load(status, { signal })),
    [tab, status, query],
  );

  async function act(key, action, message) {
    setBusy(key);
    try {
      const response = await action();
      toast.success(message || response.message);
      reload({ silent: true });
      reloadOverview({ silent: true });
    } catch (requestError) {
      toast.error(requestError);
    } finally {
      setBusy(null);
    }
  }

  const go = (next) => setParams(next, { replace: true });
  const button = (key, text, action, variant = 'soft') => (
    <Button size="xs" variant={variant} loading={busy === key} onClick={() => act(key, action)}>{text}</Button>
  );

  function renderItem(item) {
    if (tab === 'listings') {
      return (
        <Row key={item.id} avatar={item.name} title={item.name} status={item.status}
          meta={(
            <>
              <small>{[item.category?.name, item.city, item.owner && `${item.owner.name} · ${item.owner.email}`].filter(Boolean).join(' · ')}</small>
              {item.description && <span className="ad-detail">{item.description}</span>}
              <small>{[item.website, item.email, item.phone, ...(item.credentials || [])].filter(Boolean).join(' · ')}</small>
              {item.review_notes && <span className="ad-detail">Notes sent: {item.review_notes}</span>}
            </>
          )}>
          {item.status !== 'claimed_verified' && button(`a${item.id}`, 'Approve', () => moderateListing(item.id, 'approve'), 'primary')}
          {item.status !== 'rejected' && (
            <Button size="xs" variant="danger" onClick={() => setReason({
              title: `Send back “${item.name}”`, confirm: 'Send back', required: true,
              run: (notes) => act(`r${item.id}`, () => moderateListing(item.id, 'reject', notes)),
            })}>Request changes</Button>
          )}
        </Row>
      );
    }
    if (tab === 'claims') {
      return (
        <Row key={item.id} avatar={item.listing?.name || '?'} title={`${item.user?.name} → ${item.listing?.name}`} status={item.status}
          meta={(
            <>
              <small>{[item.user?.email, item.business_domain_email, item.business_phone, `Submitted ${formatShortDate(item.created_at)}`].filter(Boolean).join(' · ')}</small>
              <small>Listing contact: {[item.listing?.email, item.listing?.website].filter(Boolean).join(' · ') || 'none on file'}</small>
              {item.credential_information && <span className="ad-detail">{item.credential_information}</span>}
              {item.admin_notes && <span className="ad-detail">Notes: {item.admin_notes}</span>}
            </>
          )}>
          {item.has_document && <Button size="xs" variant="outline" onClick={() => downloadClaimDocument(item.id).catch((e) => toast.error(e))}>Document</Button>}
          {item.status === 'pending' && button(`a${item.id}`, 'Approve', () => moderateClaim(item.id, 'approve'), 'primary')}
          {item.status === 'pending' && (
            <Button size="xs" variant="danger" onClick={() => setReason({
              title: 'Reject claim', confirm: 'Reject', required: false,
              run: (notes) => act(`r${item.id}`, () => moderateClaim(item.id, 'reject', notes)),
            })}>Reject</Button>
          )}
        </Row>
      );
    }
    if (tab === 'credentials') {
      return (
        <Row key={item.id} avatar={item.educator?.name || '?'} title={item.title} status={item.status}
          meta={(
            <small>
              {item.educator && <><Link to={`/educators/${item.educator.slug}`}>{item.educator.name}</Link>{item.educator.location && ` · ${item.educator.location}`}</>}
              {[item.issuer, item.issued_on && `Issued ${formatShortDate(item.issued_on)}`, item.expires_on && `Expires ${formatShortDate(item.expires_on)}`].filter(Boolean).map((part) => ` · ${part}`)}
            </small>
          )}>
          {item.status !== 'verified' && button(`v${item.id}`, 'Verify', () => setCredentialStatus(item.id, 'verified'), 'primary')}
          {item.status !== 'rejected' && button(`x${item.id}`, 'Reject', () => setCredentialStatus(item.id, 'rejected'), 'danger')}
        </Row>
      );
    }
    return (
      <Row key={item.id} avatar={item.name} title={item.name} status={item.status}
        meta={(
          <small>
            {[item.city, item.licence_number && `Licence ${item.licence_number}`, item.owner?.email, item.submitted_at && `Submitted ${formatShortDate(item.submitted_at)}`].filter(Boolean).join(' · ')}
            {item.is_verified && ' · ✓ Verified'}
          </small>
        )}>
        {item.is_published && <Button size="xs" variant="outline" to={`/childcare/${item.slug}`}>View</Button>}
        {item.status !== 'published' && button(`a${item.id}`, 'Publish', () => moderateCentre(item.id, 'approve'), 'primary')}
        {button(`v${item.id}`, item.is_verified ? 'Remove verified' : 'Mark verified', () => moderateCentre(item.id, item.is_verified ? 'unverify' : 'verify'))}
        {item.status !== 'suspended' && button(`s${item.id}`, 'Suspend', () => moderateCentre(item.id, 'suspend'), 'danger')}
      </Row>
    );
  }

  return (
    <main className="ec-main" style={{ paddingTop: 28 }}>
      <div className="ec-container ec-stack" style={{ gap: 20 }}>
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">Moderation</h1>
            <p className="ec-sub">Review what members submit before it reaches centres, educators and families.</p>
          </div>
        </div>

        <Tabs label="Moderation queues" value={tab} onChange={(key) => { setQuery(''); setSearch(''); go({ tab: key }); }}
          tabs={Object.entries(QUEUES).map(([key, item]) => ({ key, label: item.label, count: overview ? overview[item.countKey] : undefined }))} />

        <div className="ec-row-flex ec-wrap" style={{ justifyContent: 'space-between' }}>
          <FilterPills label="Status" value={status} onChange={(key) => go({ tab, status: key })}
            options={queue.statuses.map(([key, text]) => ({ key, label: text }))} />
          {tab === 'centres' && (
            <form className="ec-row-flex" onSubmit={(event) => { event.preventDefault(); setQuery(search.trim()); }}>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, city or licence #" aria-label="Search centres" />
              <Button type="submit" size="sm" variant="secondary">Search</Button>
            </form>
          )}
        </div>

        <section className="ec-card" aria-label={queue.label}>
          {loading && !items && [0, 1, 2].map((key) => <div className="ec-row" key={key}><Skeleton height={44} /></div>)}
          {error && <ErrorState error={error} onRetry={reload} />}
          {!error && items?.length === 0 && <EmptyState title="Nothing here">This queue is clear.</EmptyState>}
          {!error && items?.map(renderItem)}
          {meta?.last_page > 1 && <div className="ec-row ec-muted" style={{ fontSize: 14 }}>Showing the first {items.length} of {meta.total}. Clear these to see more.</div>}
        </section>
      </div>
      <ReasonModal request={reason} onClose={() => setReason(null)}
        onConfirm={async (notes) => { await reason.run(notes); setReason(null); }} />
    </main>
  );
}
