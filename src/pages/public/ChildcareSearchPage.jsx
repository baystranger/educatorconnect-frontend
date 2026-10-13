import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../../components/childcare-search.css';
import Header from '../../components/Header.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useResource } from '../../hooks/useResource.js';
import { searchCentres } from '../../services/publicApi.js';
import { centreArtFor } from '../../utils/centreArt.js';
import { km } from '../../utils/format.js';

const RADII = [5, 10, 25, 50, 100];
const AGES = [['toddler', 'Toddler (18 mo–3 yrs)'], ['infant', 'Infant'], ['preschool', 'Preschool'], ['school_age', 'School age'], ['', 'Any age']];
const PROGRAMS = [['', 'Any program'], ['group_child_care', 'Group care'], ['family_child_care', 'Family care'], ['montessori', 'Montessori'], ['preschool', 'Preschool'], ['school_age_care', 'Before & after school']];
const HOURS = [['full_day', 'Full day'], ['part_day', 'Part day'], ['extended_hours', 'Extended hours'], ['', 'Any hours']];
const TOGGLES = [['spaces_available', 'Spaces available'], ['accepting_waitlist', 'Accepting waitlist'], ['has_video', 'Has welcome video'], ['verified', 'Verified centres']];
const AVAILABILITY_STYLE = {
  green: { background: '#e8f3ea', color: '#016516' },
  yellow: { background: '#fff6d6', color: '#7a5a00' },
  gray: { background: '#f4f2f6', color: '#5c566a' },
};

/** Project centres onto the stylised map: the search radius is the dashed circle. */
function mapPosition(centre, origin, radius, index, total) {
  const cx = 220;
  const cy = 350;
  const r = 190;
  if (origin && centre.latitude !== null && centre.longitude !== null) {
    const dy = (centre.latitude - origin.latitude) * 111.045;
    const dx = (centre.longitude - origin.longitude) * 111.045 * Math.cos((origin.latitude * Math.PI) / 180);
    const scale = r / Math.max(radius, 1);
    return { x: Math.min(420, Math.max(20, cx + dx * scale)), y: Math.min(740, Math.max(20, cy - dy * scale)) };
  }
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  return { x: cx + Math.cos(angle) * r * 0.6, y: cy + Math.sin(angle) * r * 0.6 };
}

function MapPanel({ results, selectedId, onSelect, origin, radius, label, onSearchArea }) {
  return (
    <aside className="childcare-map" aria-label={`Map showing centres near ${label}`}>
      <svg className="childcare-map-art" viewBox="0 0 440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="440" height="760" fill="#f1ede6" />
        <path d="M0 0h200c-30 80-100 120-200 160z" fill="#d6e5ec" />
        <ellipse cx="340" cy="560" rx="110" ry="70" fill="#dde9d8" />
        <ellipse cx="90" cy="430" rx="70" ry="50" fill="#dde9d8" />
        <path d="m0 360 440-40M200 0l40 760M0 620c150-30 300-40 440-60M330 0c10 200 50 300 110 300M0 220l440 20" fill="none" stroke="#fff" strokeWidth="14" />
        <circle cx="220" cy="350" r="190" fill="#42007b0f" stroke="#42007b" strokeDasharray="8 8" strokeWidth="2" />
        {origin && <circle cx="220" cy="350" r="7" fill="#016516" stroke="#fff" strokeWidth="3" />}
      </svg>
      {results.map((centre, index) => {
        const position = mapPosition(centre, origin, radius, index, results.length);
        return (
          <button
            className={`childcare-map-pin${centre.id === selectedId ? ' is-selected' : ''}`}
            key={centre.id}
            type="button"
            aria-label={`Show ${centre.name} on map`}
            onClick={() => onSelect(centre.id)}
            style={{ left: `${(position.x / 440) * 100}%`, top: `${(position.y / 760) * 100}%` }}
          >
            <span>{index + 1}</span>
          </button>
        );
      })}
      <button type="button" className="childcare-map-label" onClick={onSearchArea}>Search this area</button>
    </aside>
  );
}

function CentreCard({ centre, index, selected, onSelect }) {
  const art = centreArtFor(centre.slug);
  const availability = centre.availability;

  return (
    <article className={`childcare-result-card${selected ? ' is-selected' : ''}`} onMouseEnter={() => onSelect(centre.id)} onFocus={() => onSelect(centre.id)}>
      <Link
        className="childcare-card-image"
        to={`/childcare/${centre.slug}#photos`}
        aria-label={`${centre.name} photos`}
        style={{ backgroundColor: art.background, backgroundImage: centre.cover_url ? `url(${centre.cover_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {!centre.cover_url && <><span className="childcare-image-orb" style={{ backgroundColor: art.orb }} /><span className="childcare-image-sun" style={{ backgroundColor: art.sun }} /></>}
        {centre.has_welcome_video && <span className="childcare-video-label">▶ Welcome video</span>}
        {centre.photo_count > 0 && <span className="childcare-photo-count">{centre.photo_count} photos</span>}
        <span className="childcare-image-number">{index + 1}</span>
      </Link>
      <div className="childcare-card-content">
        <div className="childcare-card-heading">
          <div className="childcare-card-title">
            <h2><Link to={`/childcare/${centre.slug}`}>{centre.name}</Link></h2>
            <span>{[centre.licence_type?.label, km(centre.distance_km) || centre.city].filter(Boolean).join(' · ')}</span>
          </div>
          {availability && <span className="childcare-availability" style={AVAILABILITY_STYLE[availability.tone]}>{availability.label}</span>}
        </div>
        <div className="childcare-tags" aria-label="Centre highlights">
          {centre.is_verified && <span className="childcare-tag is-verified">✓ Verified</span>}
          {centre.age_range && <span className="childcare-tag">{centre.age_range}</span>}
          {centre.tags.map((tag) => <span className="childcare-tag" key={tag}>{tag}</span>)}
        </div>
        {centre.summary && <p className="childcare-description">{centre.summary}</p>}
        <div className="childcare-card-footer">
          <span className="childcare-hours">{centre.hours}</span>
          <div className="childcare-card-actions">
            <Link className="childcare-tour-button" to={`/childcare/${centre.slug}?action=tour`}>Book a tour</Link>
            <Link className="childcare-view-button" to={`/childcare/${centre.slug}`}>View centre</Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return <article className="childcare-result-card" aria-hidden="true"><span className="ec-skeleton" style={{ height: 200, width: '100%' }} /></article>;
}

export default function ChildcareSearchPage() {
  useDocumentTitle('Find childcare — search results');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [selectedId, setSelectedId] = useState(null);

  // The URL is the source of truth so searches are shareable and survive refresh.
  const filters = useMemo(() => ({
    location: params.get('location') || '',
    latitude: params.get('latitude') || '',
    longitude: params.get('longitude') || '',
    radius: Number(params.get('radius')) || 10,
    age_group: params.get('age_group') ?? 'toddler',
    licence_type: params.get('licence_type') || '',
    schedule: params.get('schedule') ?? 'full_day',
    spaces_available: params.get('spaces_available') === '1',
    accepting_waitlist: params.get('accepting_waitlist') === '1',
    has_video: params.get('has_video') === '1',
    verified: params.get('verified') === '1',
    sort: params.get('sort') || 'closest',
  }), [params]);

  const [locationInput, setLocationInput] = useState(filters.location || (filters.latitude ? 'Current location' : ''));
  const hasPlace = Boolean(filters.location || filters.latitude);

  const { data, meta, loading, error, reload } = useResource((signal) => searchCentres({
    ...filters,
    age_group: filters.age_group === 'any' ? undefined : filters.age_group,
    schedule: filters.schedule === 'any' ? undefined : filters.schedule,
    radius: hasPlace ? filters.radius : undefined,
    per_page: 20,
  }, { signal }), [params.toString()]);

  const results = data || [];
  const origin = meta?.origin;
  const placeLabel = filters.location ? filters.location.split(/[,(]/)[0].trim() : filters.latitude ? 'you' : 'Canada';

  function update(changes) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === false || value === null || value === undefined) next.delete(key);
      else next.set(key, value === true ? '1' : String(value));
    });
    setParams(next, { replace: false });
    setSelectedId(null);
  }

  function handleSearch(event) {
    event.preventDefault();
    const location = locationInput.trim();
    if (location && location !== 'Current location') update({ location, latitude: '', longitude: '' });
    else if (!location) update({ location: '', latitude: '', longitude: '' });
    else update({});
  }

  async function useMyLocation() {
    const coords = await geo.locate();
    if (coords) {
      setLocationInput('Current location');
      update({ ...coords, location: '' });
    }
  }

  return (
    <div className="childcare-search-page">
      <Header />
      <div className="childcare-search-toolbar">
        <div className="childcare-search-wrap">
          <form className="childcare-search-form" role="search" onSubmit={handleSearch}>
            <label className="childcare-search-field childcare-location-field">
              <span>Location</span>
              <input value={locationInput} placeholder="City or postal code" onChange={(event) => setLocationInput(event.target.value)} aria-label="Location" />
            </label>
            <span className="childcare-search-divider" />
            <label className="childcare-search-field">
              <span>Child’s age</span>
              <select value={filters.age_group} onChange={(event) => update({ age_group: event.target.value || 'any' })} aria-label="Child's age">
                {AGES.map(([value, label]) => <option key={label} value={value || 'any'}>{label}</option>)}
              </select>
            </label>
            <span className="childcare-search-divider" />
            <label className="childcare-search-field">
              <span>Program</span>
              <select value={filters.licence_type} onChange={(event) => update({ licence_type: event.target.value })} aria-label="Program">
                {PROGRAMS.map(([value, label]) => <option key={label} value={value}>{label}</option>)}
              </select>
            </label>
            <span className="childcare-search-divider" />
            <label className="childcare-search-field">
              <span>Hours</span>
              <select value={filters.schedule} onChange={(event) => update({ schedule: event.target.value || 'any' })} aria-label="Hours">
                {HOURS.map(([value, label]) => <option key={label} value={value || 'any'}>{label}</option>)}
              </select>
            </label>
            <button className="childcare-search-submit" type="submit">Search</button>
          </form>
          <div className="childcare-filter-row">
            <div className="childcare-radius-options" role="radiogroup" aria-label="Distance">
              {RADII.map((distance) => (
                <button aria-checked={filters.radius === distance} className={filters.radius === distance ? 'is-active' : ''} key={distance} onClick={() => update({ radius: distance })} role="radio" type="button">
                  {distance} km
                </button>
              ))}
            </div>
            <span className="childcare-filter-divider" />
            <div className="childcare-filter-toggles">
              {TOGGLES.map(([key, label]) => (
                <button aria-pressed={filters[key]} className={filters[key] ? 'is-active' : ''} key={key} onClick={() => update({ [key]: !filters[key] })} type="button">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="childcare-search-main">
        <div className="childcare-search-layout">
          <section className="childcare-results" aria-label="Results" aria-busy={loading}>
            <div className="childcare-results-heading">
              <h1>
                <strong>{loading ? 'Searching…' : `${meta?.total ?? 0} ${meta?.total === 1 ? 'centre' : 'centres'} near ${placeLabel}`}</strong>
                {hasPlace && <span> · within {filters.radius} km</span>}
              </h1>
              <label className="childcare-sort">Sort
                <select value={filters.sort} onChange={(event) => update({ sort: event.target.value })} aria-label="Sort results">
                  <option value="closest">Closest</option>
                  <option value="availability">Availability</option>
                </select>
              </label>
            </div>
            {geo.error && <p className="childcare-notice" role="alert">{geo.error}</p>}
            {error && (
              <div className="childcare-empty-state" role="alert">
                {error.message} <button type="button" className="ec-link-btn" onClick={() => reload()}>Try again</button>
              </div>
            )}
            {loading && !error && [0, 1, 2].map((key) => <SkeletonCard key={key} />)}
            {!loading && !error && results.map((centre, index) => (
              <CentreCard centre={centre} index={index} key={centre.id} onSelect={setSelectedId} selected={centre.id === (selectedId ?? results[0]?.id)} />
            ))}
            {!loading && !error && results.length === 0 && (
              <div className="childcare-empty-state">
                No centres match. Try a wider distance or turn off a filter.
                {!hasPlace && <> Or <button type="button" className="ec-link-btn" onClick={useMyLocation}>search near me</button>.</>}
              </div>
            )}
          </section>
          <MapPanel
            results={results}
            selectedId={selectedId ?? results[0]?.id}
            onSelect={(id) => {
              setSelectedId(id);
              const centre = results.find((item) => item.id === id);
              if (centre && window.matchMedia('(max-width: 760px)').matches) navigate(`/childcare/${centre.slug}`);
            }}
            origin={origin}
            radius={filters.radius}
            label={placeLabel}
            onSearchArea={useMyLocation}
          />
        </div>
      </main>
    </div>
  );
}
