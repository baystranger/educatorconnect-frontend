import { useState } from 'react';
import { searchTabs } from '../data.js';
import Icon, { PinIcon } from './Icon.jsx';
import PreviewCards from './PreviewCard.jsx';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('care');
  const content = searchTabs[activeTab];

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
                onClick={() => setActiveTab(key)}
              >
                <Icon name={key === 'care' ? 'home' : key === 'jobs' ? 'briefcase' : 'shield'} size={17} />
                <span className="search-tab-label">{tab.label}</span>
                <span className="search-tab-mobile-label">
                  {key === 'care' ? 'Childcare' : key === 'jobs' ? 'Jobs' : 'Services'}
                </span>
              </button>
            ))}
          </div>
          <form
            className="search-form"
            id="care"
            onSubmit={(event) => {
              event.preventDefault();
              if (activeTab === 'care') window.location.href = '/childcare-search';
            }}
          >
            {content.fields.map(([label, placeholder], index) => (
              <label className="search-field" key={label}>
                <span>{label}</span>
                <input
                  type="text"
                  placeholder={placeholder}
                  aria-label={label}
                  className={index > 0 ? 'with-divider' : ''}
                />
              </label>
            ))}
            <button className="near-me" type="button" aria-label="Near me"><PinIcon /><span>Near me</span></button>
            <button className="button search-submit" type="submit"><Icon name="search" size={18} />{content.button}</button>
          </form>
          <div className="popular-row">
            <span>Popular:</span>
            {content.chips.map((chip) => <a href="#directory" key={chip}>{chip}</a>)}
          </div>
          <p className="search-note">{content.note}</p>
        </div>

        <div className="hero-previews mobile-preview-cards" aria-label="Featured listings">
          <PreviewCards />
        </div>
      </div>
    </section>
  );
}
