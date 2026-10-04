import { centres } from '../data.js';
import Icon from './Icon.jsx';

export default function CentresSection() {
  return (
    <section className="section centres-section" id="centres">
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">For families · for centres</span>
          <h2>Centres that show you <span>who they are.</span></h2>
        </div>
        <p>Welcome videos, galleries, programs and real availability. Parents can ask questions, book tours or join waitlists — no account needed.</p>
      </div>
      <div className="centre-grid">
        {centres.map((centre) => (
          <article className="centre-card" key={centre.name}>
            <div className={`centre-art art-${centre.tone}`} style={{ backgroundColor: centre.cover }}>
              <span className="art-orb" style={{ backgroundColor: centre.orb }} /><span className="art-sun" style={{ backgroundColor: centre.sun }} />
              <span className="centre-video"><Icon name="play" size={14} /> {centre.video}</span>
              <span className="centre-availability" style={{ color: centre.availabilityColor }}>{centre.availability}</span>
            </div>
            <div className="centre-info">
              <h3>{centre.name}</h3>
              <span className="centre-verified"><Icon name="shield" size={15} />{centre.label}</span>
              <span className="centre-meta">{centre.ages} · {centre.distance}</span>
              <div className="centre-actions">
                <a className="centre-action-primary" href="#care">Book a tour</a>
                <a className="centre-action-secondary" href="#care">Ask a question</a>
              </div>
            </div>
          </article>
        ))}
        <aside className="centre-promo">
          <span className="eyebrow">Run a centre?</span>
          <h3>Showcase your centre to families and educators.</h3>
          <ul><li>Programs, ages &amp; hours</li><li>Welcome video &amp; gallery</li><li>Tours, waitlist &amp; inquiries</li></ul>
          <a className="button button-light" href="#signup">Create centre profile</a>
        </aside>
      </div>
    </section>
  );
}
