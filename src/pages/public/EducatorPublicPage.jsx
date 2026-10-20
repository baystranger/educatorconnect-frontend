import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import AppNav from '../../components/layout/AppNav.jsx';
import { ErrorState, Icon, PageLoader, VideoPlayer } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { getEducatorProfile } from '../../services/publicApi.js';
import { toDate } from '../../utils/format.js';
import '../educator/educator-profile.css';

const BADGE_TONES = { Verified: ['#E8F3EA', '#016516'], Current: ['#F4EFFA', '#42007B'], Pending: ['#FFF6D6', '#7A5A00'], Expired: ['#FDEBE4', '#B42318'], Education: ['#F4F2F6', '#3A3346'] };

/** Read-only educator profile as centres see it. Visibility rules are enforced by the API. */
export default function EducatorPublicPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data: profile, loading, error, reload } = useResource((signal) => getEducatorProfile(slug, { signal }), [slug]);
  useDocumentTitle(profile ? `${profile.full_name} — Educator` : 'Educator profile');
  const isOwner = user?.educator_profile?.slug === slug;

  const shell = (children) => (
    <div className="ec-app">
      {user ? <AppNav /> : <Header />}
      <main className="ec-main" style={{ paddingTop: 32 }}>{children}</main>
    </div>
  );

  if (loading) return shell(<PageLoader label="Loading profile…" />);
  if (error) {
    return shell(
      <div className="ec-container">
        {error.status === 404
          ? <div className="ec-card"><div className="ec-state"><strong>This profile isn’t available</strong><span>The educator may have limited who can see their profile.</span></div></div>
          : <ErrorState error={error} onRetry={reload} />}
      </div>,
    );
  }

  const location = [profile.city, profile.province === 'British Columbia' ? 'BC' : profile.province].filter(Boolean).join(', ');
  const groups = [
    ['Age groups', profile.age_groups_preferred, ['#F4EFFA', '#42007B']],
    ['Areas of expertise', profile.areas_of_expertise, ['#E8F3EA', '#016516']],
    ['Special interests', profile.special_interests, ['#FFF6D6', '#7A5A00']],
    ['Professional development', profile.professional_development, ['#F4F2F6', '#3A3346']],
  ].filter(([, items]) => items.length);

  return shell(
    <div className="ec-container" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {isOwner && (
        <div className="ec-alert ec-alert-info">This is how centres see your profile. <Link to="/educator/profile">Back to editing</Link></div>
      )}
      <section className="ec-card ep-header">
        <div className="ep-cover" aria-hidden="true"><span /><span /><span /></div>
        <div className="ep-header-body">
          <span className="ep-photo" style={{ cursor: 'default' }}>{profile.photo_url ? <img src={profile.photo_url} alt="" /> : profile.initials}</span>
          <div className="ep-identity">
            <div>
              <h1>{profile.full_name}</h1>
              {profile.is_verified && <span className="ec-pill tone-green">✓ Verified educator</span>}
              {profile.open_to_work && <span className="ec-pill tone-purple">Open to work</span>}
            </div>
            {profile.professional_title && <span className="ep-title">{profile.professional_title}</span>}
            <span className="ep-meta">{[location, profile.years_experience ? `${profile.years_experience} years experience` : null, profile.languages.join(', ')].filter(Boolean).join(' · ')}</span>
          </div>
        </div>
      </section>

      <div className="ep-layout">
        <div className="ec-stack" style={{ gap: 18 }}>
          {profile.introduction_video_url && (
            <section className="ep-section">
              <div className="ep-section-head"><h2>Introduction video</h2></div>
              <VideoPlayer src={profile.introduction_video_url} label={`${profile.full_name || 'the educator'}'s introduction video`} style={{ maxHeight: 380 }} />
            </section>
          )}
          {profile.professional_summary && <section className="ep-section"><div className="ep-section-head"><h2>About me</h2></div><p className="ep-text">{profile.professional_summary}</p></section>}
          {profile.teaching_philosophy && <section className="ep-section"><div className="ep-section-head"><h2>Teaching philosophy</h2></div><p className="ep-text">{profile.teaching_philosophy}</p></section>}
          {(profile.credentials.length > 0 || profile.criminal_record_check) && (
            <section className="ep-section" style={{ gap: 6 }}>
              <div className="ep-section-head" style={{ marginBottom: 6 }}><h2>Certifications &amp; education</h2></div>
              {profile.credentials.map((item) => {
                const [bg, fg] = BADGE_TONES[item.badge] || BADGE_TONES.Pending;
                return (
                  <div className="ep-credential" key={item.id}>
                    <span className="ep-credential-icon" style={{ background: bg, color: fg }}><Icon name="shield" size={18} /></span>
                    <span className="ep-credential-copy"><strong>{item.title}</strong><span>{[item.issuer, item.expires_on ? `valid to ${toDate(item.expires_on).getFullYear()}` : null].filter(Boolean).join(' · ')}</span></span>
                    <span className="ec-pill" style={{ background: bg, color: fg }}>{item.badge}</span>
                  </div>
                );
              })}
              {profile.criminal_record_check && <div className="ep-crc"><span><strong>Criminal record check</strong><small>{profile.criminal_record_check}</small></span></div>}
            </section>
          )}
          {groups.length > 0 && (
            <section className="ep-section" style={{ gap: 16 }}>
              <div className="ep-section-head"><h2>Skills &amp; experience</h2></div>
              {groups.map(([label, items, [bg, fg]]) => (
                <div className="ep-chip-group" key={label}><span>{label}</span><span className="ep-chips">{items.map((item) => <span key={item} style={{ background: bg, color: fg }}>{item}</span>)}</span></div>
              ))}
            </section>
          )}
        </div>
        <aside className="ep-side">
          <section className="ep-side-card">
            <strong>Looking for</strong>
            <span className="ep-chips">{profile.employment_preferences.length ? profile.employment_preferences.map((item) => <span key={item.key} style={{ background: '#F4EFFA', color: '#42007B' }}>{item.label}</span>) : <span className="ep-empty-chips">Not specified</span>}</span>
            <div className="ec-facts" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="ec-fact"><span>Availability</span><span>{profile.availability.join(', ') || '—'}</span></div>
              <div className="ec-fact"><span>Can start</span><span>{profile.available_from ? toDate(profile.available_from).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' }) : 'Flexible'}</span></div>
            </div>
          </section>
          {profile.portfolio.length > 0 && (
            <section className="ep-side-card">
              <strong>Portfolio</strong>
              {profile.portfolio.map((item) => (
                <div className="ep-file" key={item.url}>
                  <span className="ep-file-badge" style={{ background: '#E6EEF8', color: '#24466E' }}>LINK</span>
                  <span className="ep-file-copy"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>{item.note && <small>{item.note}</small>}</span>
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>,
  );
}
