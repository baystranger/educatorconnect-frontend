import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROLES } from '../constants/roles.js';
import { useAuth } from '../context/AuthContext.jsx';
import { professionalFilters } from '../data.js';
import { useResource } from '../hooks/useResource.js';
import { getProfessionalCategories, searchProfessionals } from '../services/publicApi.js';
import ClaimListingModal from './ClaimListingModal.jsx';
import Icon from './Icon.jsx';

const steps = [
  ['1', 'Find your listing', 'Search by business or professional name.'],
  ['2', 'Claim this profile', 'Sign in or create a free account.'],
  ['3', 'Verify it’s you', 'Business-domain email, phone, credentials or documents.'],
  ['✓', 'Approved — you’re in control', 'Edit services, add your logo and earn a Claimed badge.'],
];

const STATUS = {
  verified: { label: 'Verified', className: 'status-verified', cta: 'Contact', tone: 'lavender' },
  claimed: { label: 'Claimed', className: 'status-claimed', cta: 'Book a consultation', tone: 'gold' },
  unclaimed: { label: 'Unclaimed listing', className: 'status-unclaimed-listing', cta: 'Is this you? Claim profile', tone: 'neutral' },
};

/**
 * Unclaimed listings: professionals claim in place, guests sign up as a professional first,
 * and other signed-in roles (who cannot claim) see no claim button.
 */
function ProfessionalCard({ professional, onClaim }) {
  const { user } = useAuth();
  const status = STATUS[professional.listing_status] || STATUS.unclaimed;
  const unclaimed = professional.listing_status === 'unclaimed';
  const cta = professional.listing_status === 'claimed' && !professional.book_consultation ? 'Contact' : status.cta;
  const ctaClass = `professional-cta status-cta-${status.className.replace('status-', '')}`;
  const ctaHref = unclaimed ? (user ? null : '/signup?type=professional') : professional.contact_url;

  return (
    <article className="professional-card">
      <div className="professional-top">
        <div className="professional-flags">
          <span className={`status-badge ${status.className}`}>
            {professional.listing_status === 'verified' && <Icon name="shield" size={14} />}
            {status.label}
          </span>
          {professional.is_featured && <span className="featured-badge">Featured</span>}
        </div>
      </div>
      <div className="professional-profile">
        <span className={`professional-avatar avatar-${status.tone}`}>{professional.initials}</span>
        <div className="professional-details">
          <h3>{professional.name}</h3>
          <span className="professional-category">{professional.professional_title || professional.category?.name}</span>
        </div>
      </div>
      <span className="professional-area"><Icon name="pin" size={15} />{professional.service_area || professional.city}</span>
      <p>{professional.summary}</p>
      {unclaimed && user?.role === ROLES.PROFESSIONAL ? (
        <button type="button" className={ctaClass} onClick={() => onClaim(professional)}>{cta}</button>
      ) : ctaHref?.startsWith('/') ? (
        <Link className={ctaClass} to={ctaHref}>{cta}</Link>
      ) : ctaHref ? (
        <a className={ctaClass} href={ctaHref} target="_blank" rel="noopener noreferrer">{cta}</a>
      ) : null}
    </article>
  );
}

export default function ProfessionalsSection() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [claiming, setClaiming] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState({ keyword: params.get('service') || '', location: params.get('area') || '' });
  const [submitted, setSubmitted] = useState(search);
  const [claimQuery, setClaimQuery] = useState('');
  const group = professionalFilters.find(([id]) => id === filter)?.[2];

  useEffect(() => {
    const next = { keyword: params.get('service') || '', location: params.get('area') || '' };
    setSearch(next);
    setSubmitted(next);
  }, [params]);

  const { data: professionals, loading, error } = useResource(
    (signal) => searchProfessionals({ group, keyword: submitted.keyword, location: submitted.location, per_page: 4 }, { signal }),
    [group, submitted.keyword, submitted.location],
  );
  const { data: categories } = useResource((signal) => getProfessionalCategories({ signal }), []);

  return (
    <section className="section directory-section" id="directory">
      <div className="directory-heading">
        <div className="section-heading">
          <span className="eyebrow">Early childhood professional directory</span>
          <h2>Reliable services for <span>your centre.</span></h2>
          <p>Therapists, licensing consultants, trainers, designers and bookkeepers who understand early childhood — with verified and claimed badges so you know who you’re hiring.</p>
          <p className="directory-description-mobile">Therapists, licensing consultants, trainers and more — with verified and claimed badges.</p>
        </div>
        <form className="directory-search" role="search" onSubmit={(event) => { event.preventDefault(); setFilter('all'); setSubmitted(search); }}>
          <label><span>Service</span><input type="text" placeholder="e.g. speech therapy, licensing" value={search.keyword} onChange={(event) => setSearch({ ...search, keyword: event.target.value })} /></label>
          <label><span>Location</span><input type="text" placeholder="City or postal code" value={search.location} onChange={(event) => setSearch({ ...search, location: event.target.value })} /></label>
          <button className="button" type="submit" aria-label="Find services"><Icon name="search" /><span className="directory-search-label">Find services</span></button>
        </form>
      </div>
      <div className="directory-toolbar">
        <div className="filter-row" role="tablist" aria-label="Filter professional services">
          {professionalFilters.map(([id, label]) => (
            <button
              className={filter === id ? 'filter-pill selected dark-selected' : 'filter-pill'}
              type="button"
              role="tab"
              aria-selected={filter === id}
              key={id}
              onClick={() => setFilter(id)}
            >{label}</button>
          ))}
        </div>
        <span className="text-link">All {categories?.length || 27} categories</span>
      </div>
      <div className="professional-grid" aria-busy={loading}>
        {loading && Array.from({ length: 4 }, (_, index) => <article className="professional-card" key={index} aria-hidden="true"><span className="ec-skeleton" style={{ height: 220 }} /></article>)}
        {!loading && error && <p className="empty-state">The directory couldn’t load right now. Please try again shortly.</p>}
        {!loading && !error && professionals?.length === 0 && <p className="empty-state">No services match that search yet — try another service or location.</p>}
        {!loading && !error && professionals?.map((professional) => <ProfessionalCard professional={professional} key={professional.id} onClaim={setClaiming} />)}
      </div>
      <span className="mobile-categories-link">Browse all {categories?.length || 27} categories</span>
      <div className="claim-band">
        <div className="claim-copy">
          <span className="eyebrow">For professionals &amp; service providers</span>
          <h3>Your business may already be listed. <span>Claim it.</span></h3>
          <p>Claim your free profile to update your services, add your logo and credentials, and show centres a Claimed badge.</p>
          <form className="claim-search" onSubmit={(event) => { event.preventDefault(); setFilter('all'); setSearch({ keyword: claimQuery, location: '' }); setSubmitted({ keyword: claimQuery, location: '' }); }}>
            <label className="claim-search-input">
              <Icon name="search" size={18} />
              <input aria-label="Search your business or name" placeholder="Search your business or name" value={claimQuery} onChange={(event) => setClaimQuery(event.target.value)} />
            </label>
            <button className="button" type="submit">Find my listing</button>
          </form>
          <span className="claim-add">Not listed yet? <Link to={user?.role === ROLES.PROFESSIONAL ? '/professional/listings/new' : '/signup?type=professional'}>Add your professional profile</Link></span>
        </div>
        <ol className="claim-steps">
          {steps.map(([number, title, description]) => (
            <li key={number}>
              <span className={number === '✓' ? 'step-number step-complete' : 'step-number'}>{number}</span>
              <span><strong>{title}</strong><small>{description}</small></span>
            </li>
          ))}
        </ol>
      </div>
      {claiming && <ClaimListingModal listing={claiming} onClose={() => setClaiming(null)} />}
    </section>
  );
}
