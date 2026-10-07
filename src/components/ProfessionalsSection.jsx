import { professionalFilters, professionals } from '../data.js';
import Icon from './Icon.jsx';

const steps = [
  ['1', 'Find your listing', 'Search by business or professional name.'],
  ['2', 'Claim this profile', 'Sign in or create a free account.'],
  ['3', "Verify it’s you", 'Business email, phone, credentials or documents.'],
  ['✓', 'Approved', 'Edit your listing and earn a Claimed badge.'],
];

export default function ProfessionalsSection({ filter, onFilterChange }) {
  const visiblePros = professionals.filter((professional) => filter === 'all' || professional.group === filter).slice(0, 4);

  return (
    <section className="section directory-section" id="directory">
      <div className="directory-heading">
        <div className="section-heading">
          <span className="eyebrow">Professional directory</span>
          <h2>Reliable services for <span>your centre.</span></h2>
          <p>Therapists, licensing consultants, trainers, designers and bookkeepers who understand early childhood — with verified and claimed badges so you know who you’re hiring.</p>
          <p className="directory-description-mobile">Therapists, licensing consultants, trainers and more — with verified and claimed badges.</p>
        </div>
        <form className="directory-search" onSubmit={(event) => event.preventDefault()} role="search">
          <label><span>Service</span><input type="text" placeholder="e.g. speech therapy, licensing" /></label>
          <label><span>Location</span><input type="text" placeholder="City or postal code" /></label>
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
              onClick={() => onFilterChange(id)}
            >{label}</button>
          ))}
        </div>
        <a className="text-link" href="#directory">All 27 categories <span aria-hidden="true">→</span></a>
      </div>
      <div className="professional-grid">
        {visiblePros.map((professional) => (
          <article className="professional-card" key={professional.name}>
            <div className="professional-top">
              <div className="professional-flags">
                {professional.featured && <span className="featured-badge">Featured</span>}
                <span className={`status-badge status-${professional.status.toLowerCase().replaceAll(' ', '-')}`}>
                  {professional.status === 'Verified' && <Icon name="shield" size={14} />}
                  {professional.status}
                </span>
              </div>
            </div>
            <div className="professional-profile">
              <span className={`professional-avatar avatar-${professional.tone}`}>{professional.initials}</span>
              <div className="professional-details">
                <h3>{professional.name}</h3>
                <span className="professional-category">{professional.category}</span>
              </div>
            </div>
            <span className="professional-area"><Icon name="pin" size={15} />{professional.area}</span>
            <p>{professional.description}</p>
            <a className={`professional-cta status-cta-${professional.status.toLowerCase().replaceAll(' ', '-')}`} href="/signup">{professional.cta}</a>
          </article>
        ))}
      </div>
      <a className="mobile-categories-link" href="#directory">Browse all 27 categories <span aria-hidden="true">→</span></a>
      <div className="claim-band">
        <div className="claim-copy">
          <span className="eyebrow">For professionals</span>
          <h3>Your business may already be listed. <span>Claim it.</span></h3>
          <p>Update your services, add your logo and show centres a Claimed badge.</p>
          <form className="claim-search" onSubmit={(event) => event.preventDefault()}>
            <label className="claim-search-input">
              <Icon name="search" size={18} />
              <input aria-label="Search your business or name" placeholder="Search your business or name" />
            </label>
            <button className="button" type="submit">Find my listing</button>
          </form>
          <span className="claim-add">Not listed yet? <a href="/signup">Add your profile</a></span>
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
    </section>
  );
}
