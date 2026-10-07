import Icon from './Icon.jsx';

function PreviewCard({ variant, children }) {
  return (
    <article className={`preview-card ${variant}-preview`}>
      {children}
    </article>
  );
}

export default function PreviewCards() {
  return (
    <>
      <PreviewCard variant="centre">
        <div className="preview-art preview-art-landscape">
          <span className="sun" />
          <span className="hill hill-back" />
          <span className="hill hill-front" />

          <span className="video-chip">
            <Icon name="play" size={13} />
            Welcome video · 1:12
          </span>
        </div>

        <div className="preview-details">
          <div className="preview-title-row">
            <strong>Cedar &amp; Moss Nature School</strong>
            <span>2.4 km</span>
          </div>

          <p>
            <Icon name="shield" size={14} />
            Verified · Outdoor program · 2.5–5 yrs
          </p>

          <span className="availability">Spaces available</span>
        </div>
      </PreviewCard>

      <PreviewCard variant="job">
        <div className="mini-job">
          <span className="avatar avatar-gold">LS</span>

          <div>
            <strong>Early Childhood Educator</strong>
            <span>Little Sprouts Daycare · Burnaby</span>
          </div>
        </div>

        <div className="mini-tags">
          <span>Full-time</span>
          <span>ECE certificate</span>
          <span>Salary listed</span>
        </div>

        <div className="mini-job-foot">
          <span>Posted 2 days ago</span>

          <a href="#jobs">
            Apply with profile
            <Icon name="arrow" size={14} />
          </a>
        </div>
      </PreviewCard>

      <PreviewCard variant="pro">
        <div className="mini-job">
          <span className="avatar avatar-green">BL</span>

          <div>
            <strong>Brightpath Licensing</strong>
            <span>Licensing Consultants · BC-wide</span>
          </div>

          <span className="verified-badge">Verified</span>
        </div>

        <p>
          New centre setup, inspection prep and policy reviews.
        </p>
      </PreviewCard>
    </>
  );
}
