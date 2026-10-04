import { audiences } from '../data.js';
import Icon from './Icon.jsx';

export default function AudienceSection() {
  return (
    <section className="section audience-section">
      <div className="audience-heading">
        <h2>One platform, <span>three ways</span> in.</h2>
        <p>Each path is built for what you actually need to do — nothing more to learn.</p>
      </div>
      <div className="audience-grid">
        {audiences.map((audience) => (
          <article className={`audience-card tone-${audience.tone}`} key={audience.eyebrow}>
            <span className="eyebrow">{audience.eyebrow}</span>
            <h3>{audience.title}</h3>
            <ul>
              {audience.points.map((point) => <li key={point}><Icon name="check" size={17} />{point}</li>)}
            </ul>
            <div className="audience-actions">
              <a className="button" href={audience.href}>{audience.action}</a>
              <a className="text-link" href={audience.linkHref}>{audience.link} <span aria-hidden="true">→</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
