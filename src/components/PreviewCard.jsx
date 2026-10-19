import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource.js';
import { searchCentres, searchJobs, searchProfessionals } from '../services/publicApi.js';
import { timeAgo } from '../utils/format.js';
import Icon from './Icon.jsx';

const AVATAR_TONES = ['avatar-gold', 'avatar-green', 'avatar-lavender'];
const tone = (text = '') => AVATAR_TONES[[...text].reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR_TONES.length];
const settled = (promise) => promise.then((payload) => payload.data || [], () => []);

/** A real centre, job and verified professional for the hero, picked from live listings. */
async function loadPreviews(signal) {
  const [centres, jobs, professionals] = await Promise.all([
    settled(searchCentres({ per_page: 6, sort: 'availability' }, { signal })),
    settled(searchJobs({ per_page: 1 }, { signal })),
    settled(searchProfessionals({ per_page: 8 }, { signal })),
  ]);
  return {
    data: {
      centre: centres.find((c) => c.is_verified && c.has_welcome_video) || centres.find((c) => c.is_verified) || centres[0] || null,
      job: jobs[0] || null,
      professional: professionals.find((p) => p.listing_status === 'verified') || null,
    },
  };
}

function CentrePreview({ centre }) {
  const details = [centre.is_verified && 'Verified', centre.licence_type?.label, centre.age_range].filter(Boolean).join(' · ');
  return (
    <Link to={`/childcare/${centre.slug}`} className="preview-card centre-preview" aria-label={`${centre.name} — view centre`}>
      <div className="preview-art preview-art-landscape">
        <span className="sun" />
        <span className="hill hill-back" />
        <span className="hill hill-front" />
        {centre.has_welcome_video && <span className="video-chip"><Icon name="play" size={13} />Welcome video</span>}
      </div>
      <div className="preview-details">
        <div className="preview-title-row">
          <strong>{centre.name}</strong>
          {centre.distance_km != null && <span>{centre.distance_km} km</span>}
        </div>
        <p>{centre.is_verified && <Icon name="shield" size={14} />}{details}</p>
        {centre.availability?.label && <span className="availability">{centre.availability.label}</span>}
      </div>
    </Link>
  );
}

function JobPreview({ job }) {
  const tags = [job.employment_type?.label, job.number_of_positions > 1 && `${job.number_of_positions} positions`, job.pay && 'Salary listed'].filter(Boolean);
  return (
    <article className="preview-card job-preview">
      <div className="mini-job">
        <span className={`avatar ${tone(job.centre?.name)}`}>{job.centre?.initials}</span>
        <div>
          <strong>{job.title}</strong>
          <span>{[job.centre?.name, job.city].filter(Boolean).join(' · ')}</span>
        </div>
      </div>
      <div className="mini-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="mini-job-foot">
        <span>{job.published_at ? `Posted ${timeAgo(job.published_at)}` : ''}</span>
        <Link to={`/jobs/${job.slug}`}>Apply with profile<Icon name="arrow" size={14} /></Link>
      </div>
    </article>
  );
}

function ProfessionalPreview({ professional }) {
  const subtitle = [professional.category?.name || professional.professional_title, professional.service_area || professional.city].filter(Boolean).join(' · ');
  return (
    <Link to="/#directory" className="preview-card pro-preview" aria-label={`${professional.name} — professional directory`}>
      <div className="mini-job">
        <span className="avatar avatar-green">{professional.initials}</span>
        <div>
          <strong>{professional.name}</strong>
          <span>{subtitle}</span>
        </div>
        <span className="verified-badge">Verified</span>
      </div>
      {professional.summary && <p>{professional.summary}</p>}
    </Link>
  );
}

/** Live hero previews; each card appears only when there's a real listing to show. */
export default function PreviewCards() {
  const { data } = useResource((signal) => loadPreviews(signal), []);
  if (!data) return null;

  return (
    <>
      {data.centre && <CentrePreview centre={data.centre} />}
      {data.job && <JobPreview job={data.job} />}
      {data.professional && <ProfessionalPreview professional={data.professional} />}
    </>
  );
}
