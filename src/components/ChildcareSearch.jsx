import { useEffect, useMemo, useState } from 'react';
import Header from './Header.jsx';
import './childcare-search.css';

const radiusOptions = [5, 10, 25, 50, 100];

const centres = [
  {
    id: 'little-sprouts',
    name: 'Little Sprouts Daycare',
    type: 'Licensed group care',
    distance: 2.4,
    availability: 'Toddler spaces',
    open: true,
    waitlist: true,
    video: true,
    verified: true,
    photos: 24,
    tags: ['6 mo–5 yrs', 'Play-based', 'Hot lunch'],
    description: 'Family-run since 2014 with small rooms, long-serving educators and a big garden.',
    hours: 'Mon–Fri · 7:30–5:30',
    hoursType: 'Full day',
    ages: ['Infant', 'Toddler', 'Preschool'],
    programs: ['Group care'],
    colors: { background: '#fff3d1', orb: '#fbe3a4', sun: '#f7c9b8' },
    map: { x: 232, y: 300 },
  },
  {
    id: 'happy-hearts',
    name: 'Happy Hearts Early Learning',
    type: 'Preschool',
    distance: 3.1,
    availability: 'Waitlist open',
    open: false,
    waitlist: true,
    video: true,
    verified: true,
    photos: 18,
    tags: ['3–5 yrs', 'Reggio-inspired'],
    description: 'Light-filled studios and a strong focus on art, music and family partnerships.',
    hours: 'Mon–Fri · 8:00–4:00',
    hoursType: 'Full day',
    ages: ['Preschool'],
    programs: ['Group care'],
    colors: { background: '#f1e9fa', orb: '#e0d0f2', sun: '#cfe6d2' },
    map: { x: 150, y: 250 },
  },
  {
    id: 'cedar-moss',
    name: 'Cedar & Moss Nature School',
    type: 'Outdoor program',
    distance: 4.8,
    availability: 'Tours this week',
    open: true,
    waitlist: true,
    video: true,
    verified: true,
    photos: 31,
    tags: ['2.5–5 yrs', 'Nature-based'],
    description: 'Forest-school mornings and a cozy indoor studio for afternoons.',
    hours: 'Mon–Thu · 8:30–3:00',
    hoursType: 'Part day',
    ages: ['Toddler', 'Preschool'],
    programs: ['Group care'],
    colors: { background: '#eaf3eb', orb: '#d3e8d5', sun: '#ffe9a8' },
    map: { x: 300, y: 420 },
  },
  {
    id: 'maple-grove',
    name: 'Maple Grove Montessori',
    type: 'Montessori',
    distance: 7.2,
    availability: 'Full',
    open: false,
    waitlist: false,
    video: false,
    verified: true,
    photos: 9,
    tags: ['18 mo–6 yrs', 'Montessori'],
    description: 'Authentic Montessori classrooms with trained guides.',
    hours: 'Mon–Fri · 7:45–5:15',
    hoursType: 'Full day',
    ages: ['Toddler', 'Preschool', 'School age'],
    programs: ['Montessori'],
    colors: { background: '#e6eef8', orb: '#cfddef', sun: '#fbe3a4' },
    map: { x: 110, y: 470 },
  },
  {
    id: 'kingsway-family',
    name: 'Kingsway Family Childcare',
    type: 'Licensed family care',
    distance: 9.4,
    availability: 'Infant spaces',
    open: true,
    waitlist: true,
    video: false,
    verified: false,
    photos: 6,
    tags: ['Infant–3 yrs', 'Small group'],
    description: 'A home-based setting with up to 7 children and one familiar caregiver.',
    hours: 'Mon–Fri · 7:00–5:00',
    hoursType: 'Extended hours',
    ages: ['Infant', 'Toddler'],
    programs: ['Family care'],
    colors: { background: '#fdebe4', orb: '#f7d3c6', sun: '#e6b300' },
    map: { x: 340, y: 180 },
  },
];

const availabilityColors = {
  open: { background: '#e8f3ea', color: '#016516' },
  waitlist: { background: '#fff6d6', color: '#7a5a00' },
  full: { background: '#f4f2f6', color: '#5c566a' },
};

function MapPanel({ results, selectedId, onSelect, location }) {
  return (
    <aside className="childcare-map" aria-label={`Map showing centres near ${location}`}>
      <svg className="childcare-map-art" viewBox="0 0 440 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="440" height="760" fill="#f1ede6" />
        <path d="M0 0h200c-30 80-100 120-200 160z" fill="#d6e5ec" />
        <ellipse cx="340" cy="560" rx="110" ry="70" fill="#dde9d8" />
        <ellipse cx="90" cy="430" rx="70" ry="50" fill="#dde9d8" />
        <path d="m0 360 440-40M200 0l40 760M0 620c150-30 300-40 440-60M330 0c10 200 50 300 110 300M0 220l440 20" fill="none" stroke="#fff" strokeWidth="14" />
        <circle cx="220" cy="350" r="190" fill="#42007b0f" stroke="#42007b" strokeDasharray="8 8" strokeWidth="2" />
        <circle cx="220" cy="350" r="7" fill="#016516" stroke="#fff" strokeWidth="3" />
      </svg>
      {results.map((centre, index) => (
        <button
          className={`childcare-map-pin${centre.id === selectedId ? ' is-selected' : ''}`}
          key={centre.id}
          type="button"
          aria-label={`Show ${centre.name} on map`}
          onClick={() => onSelect(centre.id)}
          style={{
            left: `${centre.map.x / 440 * 100}%`,
            top: `${centre.map.y / 760 * 100}%`,
          }}
        >
          <span>{index + 1}</span>
        </button>
      ))}
      <span className="childcare-map-label">Search this area</span>
    </aside>
  );
}

function CentreCard({ centre, index, selected, onSelect, onTour }) {
  const availabilityClass = centre.open ? 'open' : centre.waitlist ? 'waitlist' : 'full';
  const availabilityStyle = availabilityColors[availabilityClass];

  return (
    <article
      className={`childcare-result-card${selected ? ' is-selected' : ''}`}
      onMouseEnter={() => onSelect(centre.id)}
      onFocus={() => onSelect(centre.id)}
    >
      <a
        className="childcare-card-image"
        href={`#${centre.id}`}
        aria-label={`${centre.name} photos`}
        onClick={(event) => { event.preventDefault(); onSelect(centre.id); }}
        style={{ backgroundColor: centre.colors.background }}
      >
        <span className="childcare-image-orb" style={{ backgroundColor: centre.colors.orb }} />
        <span className="childcare-image-sun" style={{ backgroundColor: centre.colors.sun }} />
        {centre.video && <span className="childcare-video-label">▶ Welcome video</span>}
        <span className="childcare-photo-count">{centre.photos} photos</span>
        <span className="childcare-image-number">{index + 1}</span>
      </a>
      <div className="childcare-card-content">
        <div className="childcare-card-heading">
          <div className="childcare-card-title">
            <h2>{centre.name}</h2>
            <span>{centre.type} · {centre.distance.toFixed(1)} km</span>
          </div>
          <span className="childcare-availability" style={availabilityStyle}>{centre.availability}</span>
        </div>
        <div className="childcare-tags" aria-label="Centre highlights">
          {centre.verified && <span className="childcare-tag is-verified">✓ Verified</span>}
          {centre.tags.map((tag) => <span className="childcare-tag" key={tag}>{tag}</span>)}
        </div>
        <p className="childcare-description">{centre.description}</p>
        <div className="childcare-card-footer">
          <span className="childcare-hours">{centre.hours}</span>
          <div className="childcare-card-actions">
            <button className="childcare-tour-button" type="button" onClick={() => onTour(centre.name)}>Book a tour</button>
            <button className="childcare-view-button" type="button" onClick={() => onSelect(centre.id)}>View centre</button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ChildcareSearch() {
  const [location, setLocation] = useState('Burnaby, BC (V5H)');
  const [searchLocation, setSearchLocation] = useState('Burnaby');
  const [age, setAge] = useState('Toddler (18 mo–3 yrs)');
  const [program, setProgram] = useState('Any program');
  const [hours, setHours] = useState('Full day');
  const [radius, setRadius] = useState(10);
  const [filters, setFilters] = useState({ available: false, waitlist: false, video: false, verified: false });
  const [sort, setSort] = useState('Closest');
  const [selectedId, setSelectedId] = useState('little-sprouts');
  const [notice, setNotice] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Find childcare — search results';
    return () => { document.title = previousTitle; };
  }, []);

  const results = useMemo(() => {
    const ageKey = age.startsWith('Infant') ? 'Infant'
      : age.startsWith('Toddler') ? 'Toddler'
        : age.startsWith('Preschool') ? 'Preschool'
          : age.startsWith('School age') ? 'School age' : '';
    const filtered = centres.filter((centre) => (
      (!hasSearched || /burnaby|v5h/i.test(searchLocation))
      && centre.distance <= radius
      && (!filters.available || centre.open)
      && (!filters.waitlist || centre.waitlist)
      && (!filters.video || centre.video)
      && (!filters.verified || centre.verified)
      && (!hasSearched || !ageKey || centre.ages.includes(ageKey))
      && (!hasSearched || program === 'Any program' || centre.programs.includes(program))
      && (!hasSearched || hours === 'Any hours' || centre.hoursType === hours)
    ));

    return [...filtered].sort((a, b) => sort === 'Availability'
      ? Number(b.open) - Number(a.open) || a.distance - b.distance
      : a.distance - b.distance);
  }, [age, filters, hasSearched, hours, program, radius, searchLocation, sort]);

  function toggleFilter(key) {
    setFilters((current) => ({ ...current, [key]: !current[key] }));
  }

  function handleSearch(event) {
    event.preventDefault();
    const place = location.trim();
    setSearchLocation(place ? place.split(/[,(]/)[0].trim() : 'Burnaby');
    setHasSearched(true);
    setSelectedId('');
    setNotice('');
  }

  function handleTour(name) {
    setNotice(`Tour requests for ${name} will be available when centre services are connected.`);
  }

  const toggles = [
    ['available', 'Spaces available'],
    ['waitlist', 'Accepting waitlist'],
    ['video', 'Has welcome video'],
    ['verified', 'Verified centres'],
  ];

  return (
    <div className="childcare-search-page">
      <Header />
      <div className="childcare-search-toolbar">
        <div className="childcare-search-wrap">
          <form className="childcare-search-form" role="search" onSubmit={handleSearch}>
            <label className="childcare-search-field childcare-location-field">
              <span>Location</span>
              <input value={location} onChange={(event) => setLocation(event.target.value)} aria-label="Location" />
            </label>
            <span className="childcare-search-divider" />
            <label className="childcare-search-field">
              <span>Child’s age</span>
              <select value={age} onChange={(event) => setAge(event.target.value)} aria-label="Child's age">
                <option>Toddler (18 mo–3 yrs)</option>
                <option>Infant</option>
                <option>Preschool</option>
                <option>School age</option>
              </select>
            </label>
            <span className="childcare-search-divider" />
            <label className="childcare-search-field">
              <span>Program</span>
              <select value={program} onChange={(event) => setProgram(event.target.value)} aria-label="Program">
                <option>Any program</option>
                <option>Group care</option>
                <option>Family care</option>
                <option>Montessori</option>
              </select>
            </label>
            <span className="childcare-search-divider" />
            <label className="childcare-search-field">
              <span>Hours</span>
              <select value={hours} onChange={(event) => setHours(event.target.value)} aria-label="Hours">
                <option>Full day</option>
                <option>Part day</option>
                <option>Extended hours</option>
                <option>Any hours</option>
              </select>
            </label>
            <button className="childcare-search-submit" type="submit">Search</button>
          </form>
          <div className="childcare-filter-row">
            <div className="childcare-radius-options" role="radiogroup" aria-label="Distance">
              {radiusOptions.map((distance) => (
                <button
                  aria-checked={radius === distance}
                  className={radius === distance ? 'is-active' : ''}
                  key={distance}
                  onClick={() => setRadius(distance)}
                  role="radio"
                  type="button"
                >{distance} km</button>
              ))}
            </div>
            <span className="childcare-filter-divider" />
            <div className="childcare-filter-toggles">
              {toggles.map(([key, label]) => (
                <button
                  aria-pressed={filters[key]}
                  className={filters[key] ? 'is-active' : ''}
                  key={key}
                  onClick={() => toggleFilter(key)}
                  type="button"
                >{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="childcare-search-main">
        <div className="childcare-search-layout">
          <section className="childcare-results" aria-label="Results">
            <div className="childcare-results-heading">
              <h1><strong>{results.length} {results.length === 1 ? 'centre' : 'centres'} near {searchLocation}</strong> <span>· within {radius} km</span></h1>
              <label className="childcare-sort">Sort
                <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort results">
                  <option>Closest</option>
                  <option>Availability</option>
                </select>
              </label>
            </div>
            {notice && <p className="childcare-notice" role="status">{notice}</p>}
            {results.length ? results.map((centre, index) => (
              <CentreCard
                centre={centre}
                index={index}
                key={centre.id}
                onSelect={setSelectedId}
                onTour={handleTour}
                selected={centre.id === selectedId}
              />
            )) : (
              <div className="childcare-empty-state">No centres match. Try a wider distance or turn off a filter.</div>
            )}
          </section>
          <MapPanel results={results} selectedId={selectedId} onSelect={setSelectedId} location={searchLocation} />
        </div>
      </main>
    </div>
  );
}
