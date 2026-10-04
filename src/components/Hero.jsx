import { useState } from 'react';
import { searchTabs } from '../data.js';
import Icon, { PinIcon } from './Icon.jsx';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('care');
  const content = searchTabs[activeTab];

  return (
    <section className="hero" id="top">
      <div className="hero-orbit" />
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="hero-kicker"><span className="status-dot" />Canada’s early childhood community</span>
          <h1>Where early childhood<br /><span>comes together.</span></h1>
          <p>Find childcare near you, land your next ECE role, or hire trusted services for your centre — all in one place.</p>
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
                {tab.label}
              </button>
            ))}
          </div>
          <form className="search-form" id="care" onSubmit={(event) => event.preventDefault()}>
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
            <button className="near-me" type="button"><PinIcon /> Near me</button>
            <button className="button search-submit" type="submit"><Icon name="search" size={18} />{content.button}</button>
          </form>
          <div className="popular-row">
            <span>Popular:</span>
            {content.chips.map((chip) => <a href="#directory" key={chip}>{chip}</a>)}
          </div>
          <p className="search-note">{content.note}</p>
        </div>

        <div className="hero-previews" aria-label="Featured listings">
          
        </div>
      </div>
    </section>
  );
}
