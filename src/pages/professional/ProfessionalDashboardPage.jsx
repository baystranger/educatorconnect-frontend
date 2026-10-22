import { Link } from 'react-router-dom';
import { Alert, Avatar, Button, EmptyState, ErrorState, Icon, Pill, Skeleton } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useLiveRefresh } from '../../hooks/useLiveRefresh.js';
import { useResource } from '../../hooks/useResource.js';
import { getMyListings } from '../../services/professionalApi.js';
import { formatShortDate, greeting, plural } from '../../utils/format.js';
import './professional.css';

const LISTING_TONES = { claimed_verified: 'green', pending_review: 'yellow', rejected: 'danger', unclaimed: 'gray' };
const CLAIM_STATUS = { pending: ['In review', 'yellow'], approved: ['Approved', 'green'], rejected: ['Not approved', 'danger'] };

function ListingRow({ listing }) {
  return (
    <div className="ec-row pr-row">
      <Avatar initials={listing.initials} name={listing.name} src={listing.logo_url} size={48} />
      <span className="pr-row-copy">
        <span className="ec-row-flex ec-wrap" style={{ gap: 8 }}>
          <strong>{listing.name}</strong>
          <Pill size="sm" tone={LISTING_TONES[listing.status] || 'gray'}>{listing.status_label}</Pill>
        </span>
        <small>{[listing.category?.name, listing.city, listing.is_live && plural(listing.profile_views, 'profile view')].filter(Boolean).join(' · ')}</small>
        {listing.status === 'rejected' && listing.review_notes && (
          <span className="pr-notes"><strong>Reviewer notes:</strong> {listing.review_notes}</span>
        )}
      </span>
      <span className="ec-actions pr-row-actions">
        {listing.is_live && <Button size="sm" variant="outline" to={`/?service=${encodeURIComponent(listing.name)}#directory`}>View in directory</Button>}
        <Button size="sm" variant="soft" to={`/professional/listings/${listing.id}/edit`}>Edit</Button>
      </span>
    </div>
  );
}

export default function ProfessionalDashboardPage() {
  useDocumentTitle('My listings');
  const { user } = useAuth();
  const { data, loading, error, reload } = useResource((signal) => getMyListings({ signal }), []);
  useLiveRefresh(reload);
  const listings = data?.listings || [];
  const claims = (data?.claims || []).filter((claim) => claim.status !== 'approved');
  const inReview = listings.filter((listing) => listing.status === 'pending_review').length;

  return (
    <main className="ec-main" style={{ paddingTop: 28 }}>
      <div className="ec-container ec-stack">
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">{greeting()}, {user?.name?.split(' ')[0]}</h1>
            <p className="ec-sub">Manage how childcare centres find you in the professional directory.</p>
          </div>
          <div className="ec-actions">
            <Button variant="outline" to="/#directory">Claim an existing listing</Button>
            <Button to="/professional/listings/new"><Icon name="plus" size={16} strokeWidth={2.6} />Add a listing</Button>
          </div>
        </div>

        {!user?.email_verified && <Alert tone="warning">Verify your email address so we can contact you about your listing review.</Alert>}
        {inReview > 0 && <Alert tone="info">{plural(inReview, 'listing')} {inReview === 1 ? 'is' : 'are'} waiting for an administrator to review. We’ll notify you as soon as {inReview === 1 ? 'it goes' : 'they go'} live.</Alert>}

        <section className="ec-card" aria-labelledby="pr-listings">
          <div className="ec-card-head"><h2 className="ec-h2" id="pr-listings">Your listings</h2></div>
          {loading && !data && [0, 1].map((key) => <div className="ec-row" key={key}><Skeleton height={48} /></div>)}
          {error && <ErrorState error={error} onRetry={reload} />}
          {!error && data && listings.length === 0 && (
            <div className="ec-divider-top">
              <EmptyState title="You don’t have a listing yet"
                action={<Button size="sm" to="/professional/listings/new">Create your listing</Button>}>
                Add your practice so centres can find you — or claim a listing we’ve already created for you from the directory.
              </EmptyState>
            </div>
          )}
          {listings.map((listing) => <ListingRow key={listing.id} listing={listing} />)}
        </section>

        {claims.length > 0 && (
          <section className="ec-card" aria-labelledby="pr-claims">
            <div className="ec-card-head"><h2 className="ec-h2" id="pr-claims">Your claims</h2></div>
            {claims.map((claim) => {
              const [label, tone] = CLAIM_STATUS[claim.status] || CLAIM_STATUS.pending;
              return (
                <div className="ec-row pr-row" key={claim.id}>
                  <Avatar name={claim.listing?.name} initials={claim.listing?.name?.slice(0, 2).toUpperCase()} size={40} />
                  <span className="pr-row-copy">
                    <strong>{claim.listing?.name || 'Removed listing'}</strong>
                    <small>Submitted {formatShortDate(claim.created_at)}{claim.listing?.city ? ` · ${claim.listing.city}` : ''}</small>
                    {claim.admin_notes && <span className="pr-notes"><strong>Reviewer notes:</strong> {claim.admin_notes}</span>}
                  </span>
                  <Pill size="sm" tone={tone}>{label}</Pill>
                </div>
              );
            })}
          </section>
        )}

        <p className="ec-muted" style={{ fontSize: 14, margin: 0 }}>
          Listings are reviewed by the Educator Connect team before they appear publicly. Questions? <Link to="/#footer">Visit the Help Centre</Link>.
        </p>
      </div>
    </main>
  );
}
