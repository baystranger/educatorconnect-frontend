import { trustItems } from '../data.js';
import Icon from './Icon.jsx';

export default function TrustSection() {
  return (
    <section className="trust-section">
      <div className="trust-grid">
        {trustItems.map((item) => (
          <article className="trust-item" key={item.title}>
            <span className={`trust-icon tone-${item.tone}`}><Icon name="shield" size={21} /></span>
            <div><h3>{item.title}</h3><p>{item.description}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
