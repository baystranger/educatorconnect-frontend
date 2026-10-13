import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource.js';
import { searchCentres } from '../services/publicApi.js';
import { centreArtFor } from '../utils/centreArt.js';
import { km } from '../utils/format.js';
import Icon from './Icon.jsx';

const AVAILABILITY_COLOURS = { green: '#016516', yellow: '#7A5A00', gray: '#5C566A' };

export default function CentresSection() {
  const { data: centres, loading, error } = useResource(
    (signal) => searchCentres({ per_page: 3, sort: 'availability' }, { signal }),
    [],
  );

  return (
    <section className="section centres-section" id="centres">
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">For families · for centres</span>
          <h2>Centres that show you <span>who they are.</span></h2>
        </div>
        <p>Welcome videos, galleries, programs and real availability. Parents can book tours, ask questions or join waitlists — no account needed.</p>
      </div>
      <div className="centre-grid">
        <div className="centre-card-track" aria-busy={loading}>
          {loading && Array.from({ length: 3 }, (_, index) => (
            <article className="centre-card" key={index} aria-hidden="true"><span className="ec-skeleton" style={{ height: 260 }} /></article>
          ))}
          {!loading && (error || centres?.length === 0) && (
            <article className="centre-card"><div className="centre-info"><h3>Centres are joining every week</h3><span className="centre-meta">Search childcare near you to see who’s listed.</span><div className="centre-actions"><Link className="centre-action-primary" to="/childcare">Search childcare</Link></div></div></article>
          )}
          {!loading && centres?.map((centre) => {
            const art = centreArtFor(centre.slug);
            return (
              <article className="centre-card" key={centre.id}>
                <Link
                  className={`centre-art art-${art.tone}`}
                  to={`/childcare/${centre.slug}`}
                  aria-label={`${centre.name} profile`}
                  style={{ backgroundColor: art.background, backgroundImage: centre.cover_url ? `url(${centre.cover_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {!centre.cover_url && <><span className="art-orb" style={{ backgroundColor: art.orb }} /><span className="art-sun" style={{ backgroundColor: art.sun }} /></>}
                  {centre.has_welcome_video && <span className="centre-video"><Icon name="play" size={14} /> Video</span>}
                  {centre.availability && (
                    <span className="centre-availability" style={{ color: AVAILABILITY_COLOURS[centre.availability.tone] }}>{centre.availability.label}</span>
                  )}
                </Link>
                <div className="centre-info">
                  <h3><Link to={`/childcare/${centre.slug}`}>{centre.name}</Link></h3>
                  <span className="centre-verified">
                    {centre.is_verified && <Icon name="shield" size={15} />}
                    {[centre.is_verified ? 'Verified' : null, centre.licence_type?.label].filter(Boolean).join(' · ')}
                  </span>
                  <span className="centre-meta">{[centre.age_range, centre.city, km(centre.distance_km)].filter(Boolean).join(' · ')}</span>
                  <div className="centre-actions">
                    <Link className="centre-action-primary" to={`/childcare/${centre.slug}?action=tour`}>Book a tour</Link>
                    <Link className="centre-action-secondary" to={`/childcare/${centre.slug}?action=inquiry`}>Ask a question</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="centre-promo">
          <span className="eyebrow">Run a centre?</span>
          <h3>Showcase your centre to families and educators.</h3>
          <p className="centre-promo-mobile-copy">Programs, welcome video, gallery, tours and waitlist — in one profile.</p>
          <ul><li>Programs, ages &amp; hours</li><li>Welcome video &amp; gallery</li><li>Tours, waitlist &amp; inquiries</li></ul>
          <Link className="button button-light" to="/signup?type=centre">Create centre profile</Link>
        </aside>
      </div>
    </section>
  );
}
