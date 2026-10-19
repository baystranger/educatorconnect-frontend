import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchTabs } from '../data.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import Icon, { PinIcon } from './Icon.jsx';
import PreviewCards from './PreviewCard.jsx';

const AGE_WORDS = [['infant', /infant|baby|0|1 ?y/i], ['toddler', /toddler|2 ?y|18/i], ['preschool', /pre|3|4|5/i], ['school_age', /school/i]];
const TYPE_WORDS = [['practicum', /practic/i], ['full_time', /full/i], ['part_time', /part/i], ['casual', /casual/i], ['substitute', /sub|call/i], ['contract', /contract/i]];

function matchKey(text, table) {
  return table.find(([, pattern]) => pattern.test(text || ''))?.[0];
}

/** Builds the destination URL for the hero search, per tab. */
function searchUrl(tab, values, coords) {
  const params = new URLSearchParams();
  if (coords) {
    params.set('latitude', coords.latitude);
    params.set('longitude', coords.longitude);
  }
  if (tab === 'care') {
    if (values.location && !coords) params.set('location', values.location);
    const age = matchKey(values.age, AGE_WORDS);
    if (age) params.set('age_group', age);
    return `/childcare?${params}`;
  }
  if (tab === 'jobs') {
    if (values.keyword) params.set('keyword', values.keyword);
    if (values.location && !coords) params.set('location', values.location);
    const type = matchKey(values.type, TYPE_WORDS);
    if (type) params.set('employment_types', type);
    return `/jobs?${params}`;
  }
  const query = new URLSearchParams();
  if (values.keyword) query.set('service', values.keyword);
  if (values.location) query.set('area', values.location);
  return `/?${query}#directory`;
}

export default function Hero() {
  const [activeTab, setActiveTab] = useState('care');
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const geo = useGeolocation();
  const content = searchTabs[activeTab];

  function submit(event) {
    event.preventDefault();
    navigate(searchUrl(activeTab, values));
  }

  async function nearMe() {
    const coords = await geo.locate();
    if (coords) navigate(searchUrl(activeTab, values, coords));
  }

  return (
    <section className="hero" id="top">
      <div className="hero-orbit" />
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="hero-kicker"><span className="status-dot" />Canada’s early childhood community</span>
          <h1 aria-label="Where early childhood comes together.">
            <span className="hero-title-desktop" aria-hidden="true">
              Where early childhood<br className="hero-desktop-break" />
              <span className="hero-highlight">comes together.</span>
            </span>
            <span className="hero-title-mobile" aria-hidden="true">
              Where early<br />
              childhood <span className="hero-highlight">comes</span><br />
              <span className="hero-highlight">together.</span>
            </span>
          </h1>
          <p>
            <span className="hero-copy-desktop">
              Find childcare near you, land your next ECE role, or hire trusted services for your centre — all in one place.
            </span>
            <span className="hero-copy-mobile">
              Find childcare near you, land your next ECE role, or hire trusted services for your centre.
            </span>
          </p>
        </div>

        <div className="search-module">
          <div className="search-tabs" role="tablist" aria-label="What are you looking for?">
            {Object.entries(searchTabs).map(([key, tab]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                className={activeTab === key ? 'search-tab active' : 'search-tab'}
                onClick={() => { setActiveTab(key); setValues({}); }}
              >
                <Icon name={key === 'care' ? 'home' : key === 'jobs' ? 'briefcase' : 'shield'} size={17} />
                <span className="search-tab-label">{tab.label}</span>
                <span className="search-tab-mobile-label">
                  {key === 'care' ? 'Childcare' : key === 'jobs' ? 'Jobs' : 'Services'}
                </span>
              </button>
            ))}
          </div>
          <form className="search-form" id="care" role="search" onSubmit={submit}>
            {content.fields.map(([name, label, placeholder], index) => (
              <label className="search-field" key={name}>
                <span>{label}</span>
                <input
                  type="text"
                  placeholder={placeholder}
                  aria-label={label}
                  className={index > 0 ? 'with-divider' : ''}
                  value={values[name] || ''}
                  onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))}
                />
              </label>
            ))}
            {activeTab !== 'pros' && (
              <button className="near-me" type="button" aria-label="Search near me" onClick={nearMe} disabled={geo.loading}>
                <PinIcon /><span>{geo.loading ? 'Locating…' : 'Near me'}</span>
              </button>
            )}
            <button className="button search-submit" type="submit"><Icon name="search" size={18} />{content.button}</button>
          </form>
          <div className="popular-row">
            <span>Popular:</span>
            {content.chips.map(([label, href]) => <Link to={href} key={label}>{label}</Link>)}
          </div>
          <p className="search-note" role={geo.error ? 'alert' : undefined}>{geo.error || content.note}</p>
        </div>

        <div className="hero-previews mobile-preview-cards" aria-label="Featured listings">
          <PreviewCards />
        </div>
      </div>
    </section>
  );
}
