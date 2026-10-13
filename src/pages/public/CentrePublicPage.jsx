import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';
import { ErrorState, Icon, PageLoader } from '../../components/ui/index.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { getCentre, sendParentRequest } from '../../services/publicApi.js';
import { centreArtFor } from '../../utils/centreArt.js';
import { avatarTone, formatDateTime, km } from '../../utils/format.js';
import { isEmail } from '../../utils/validation.js';
import './centre-public.css';

const CHILD_AGES = ['Under 1 year', '1 year', '2 years', '3 years', '4–5 years', '5+ years', 'Expecting'];
const ACTIONS = [['inquiry', 'Ask a question'], ['tour', 'Book a tour'], ['waitlist', 'Join waitlist']];
const AVAILABILITY_TONE = { spaces: ['#E8F3EA', '#016516'], waitlist: ['#FFF6D6', '#7A5A00'], full: ['#F4F2F6', '#5C566A'] };
const TEAM_TONES = { purple: ['#F4EFFA', '#42007B'], green: ['#E8F3EA', '#016516'], gold: ['#FFF6D6', '#7A5A00'], blue: ['#E6EEF8', '#24466E'], peach: ['#FDEBE4', '#8A3414'] };
const SAVED_KEY = 'ec-saved-centres';

/** Next four tour slots: the next two weekdays at 10 AM and 3:30 PM. Centres confirm by email. */
function tourSlots() {
  const slots = [];
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  while (slots.length < 4) {
    day.setDate(day.getDate() + 1);
    if (day.getDay() === 0 || day.getDay() === 6) continue;
    for (const [hour, minute] of [[10, 0], [15, 30]]) {
      const slot = new Date(day);
      slot.setHours(hour, minute, 0, 0);
      slots.push(slot);
    }
  }
  return slots.slice(0, 4);
}

function desiredStarts() {
  const now = new Date();
  const year = now.getFullYear();
  const september = now.getMonth() >= 8 ? year + 1 : year;
  return ['As soon as possible', `January ${year + 1}`, `September ${september}`];
}

function readSaved() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch { return []; }
}

function PhotoTile({ photo, art, className = '', onClick, label, children }) {
  return (
    <button
      type="button"
      className={`cp-tile ${className}`}
      onClick={onClick}
      aria-label={label}
      style={{ backgroundColor: art.background, backgroundImage: photo ? `url(${photo})` : undefined }}
    >
      {!photo && <><span className="cp-orb" style={{ background: art.orb }} /><span className="cp-sun" style={{ background: art.sun }} /></>}
      {children}
    </button>
  );
}

function ContactPanel({ centre, initialTab }) {
  const [tab, setTab] = useState(ACTIONS.some(([key]) => key === initialTab) ? initialTab : 'inquiry');
  const slots = useMemo(tourSlots, []);
  const starts = useMemo(desiredStarts, []);
  const programs = centre.programs?.length ? centre.programs.map((p) => p.name) : ['Infant', 'Toddler', 'Preschool'];
  const blank = { parent_name: '', email: '', phone: '', child_age: CHILD_AGES[0], program_of_interest: programs[0], desired_start: starts[0], preferred_contact_method: 'email', message: '' };
  const [form, setForm] = useState(blank);
  const [slot, setSlot] = useState(0);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(null);
  const availability = centre.availability_detail;

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function send() {
    const nextErrors = {};
    if (!form.parent_name.trim()) nextErrors.parent_name = 'Enter your name.';
    if (!isEmail(form.email)) nextErrors.email = 'Enter a valid email.';
    if (!consent) nextErrors.consent = 'Please agree before sending.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSending(true);
    try {
      const payload = await sendParentRequest(centre.slug, {
        type: tab,
        ...form,
        desired_start: tab === 'inquiry' ? undefined : form.desired_start,
        requested_at: tab === 'tour' ? slots[slot].toISOString() : undefined,
        consent: true,
      });
      setSent({ type: tab, message: payload.message });
    } catch (error) {
      const fieldErrors = Object.fromEntries(Object.entries(error.errors || {}).map(([key, value]) => [key, value[0]]));
      setErrors(Object.keys(fieldErrors).length ? fieldErrors : { form: error.message });
    } finally {
      setSending(false);
    }
  }

  const sentTitle = sent?.type === 'tour' ? `Tour requested for ${formatDateTime(slots[slot])}` : sent?.type === 'waitlist' ? 'Waitlist request sent' : 'Question sent';

  return (
    <div className="cp-panel" id="contact">
      {availability && (
        <div className={`cp-panel-status ${availability.has_spaces ? '' : 'is-none'}`}>
          <strong>{availability.headline}</strong>
          {availability.detail && <span>{availability.detail}</span>}
        </div>
      )}
      <div className="cp-panel-tabs" role="tablist" aria-label="Contact the centre">
        {ACTIONS.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key ? 'true' : 'false'} onClick={() => { setTab(key); setSent(null); setErrors({}); }}>
            {label}
          </button>
        ))}
      </div>
      {sent ? (
        <div className="cp-sent" role="status">
          <span className="cp-sent-icon"><Icon name="check" size={26} strokeWidth={2.6} /></span>
          <strong>{sentTitle}</strong>
          <span>We’ve emailed you a copy. {centre.name} will reply by your preferred contact method.</span>
          <button type="button" className="cp-link-btn" onClick={() => { setSent(null); setConsent(false); setForm(blank); }}>Send another request</button>
        </div>
      ) : (
        <div className="cp-form">
          <div className="cp-form-grid">
            <label className="cp-lb cp-span-2">Parent / guardian name
              <input className="cp-f" autoComplete="name" value={form.parent_name} onChange={set('parent_name')} aria-invalid={errors.parent_name ? 'true' : undefined} />
              {errors.parent_name && <span className="cp-error">{errors.parent_name}</span>}
            </label>
            <label className="cp-lb">Email
              <input className="cp-f" type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={errors.email ? 'true' : undefined} />
              {errors.email && <span className="cp-error">{errors.email}</span>}
            </label>
            <label className="cp-lb">Phone
              <input className="cp-f" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} aria-invalid={errors.phone ? 'true' : undefined} />
              {errors.phone && <span className="cp-error">{errors.phone}</span>}
            </label>
            <label className="cp-lb">Child’s age
              <select className="cp-f" value={form.child_age} onChange={set('child_age')}>{CHILD_AGES.map((age) => <option key={age}>{age}</option>)}</select>
            </label>
            <label className="cp-lb">Program
              <select className="cp-f" value={form.program_of_interest} onChange={set('program_of_interest')}>{programs.map((name) => <option key={name}>{name}</option>)}</select>
            </label>
          </div>
          {tab === 'tour' && (
            <div className="cp-lb" role="radiogroup" aria-label="Tour time">Pick a tour time
              <div className="cp-slots">
                {slots.map((time, index) => (
                  <button key={time.toISOString()} type="button" role="radio" aria-checked={slot === index ? 'true' : 'false'} onClick={() => setSlot(index)}>
                    {formatDateTime(time).replace(/, (\d)/, ' · $1')}
                  </button>
                ))}
              </div>
              {errors.requested_at && <span className="cp-error">{errors.requested_at}</span>}
            </div>
          )}
          {tab === 'waitlist' && (
            <label className="cp-lb">Desired start
              <select className="cp-f" value={form.desired_start} onChange={set('desired_start')}>{starts.map((start) => <option key={start}>{start}</option>)}</select>
            </label>
          )}
          <label className="cp-lb">Preferred contact
            <select className="cp-f" value={form.preferred_contact_method} onChange={set('preferred_contact_method')}>
              <option value="email">Email</option><option value="phone">Phone</option><option value="text">Text message</option>
            </select>
          </label>
          <label className="cp-lb">Message <small>optional</small>
            <textarea className="cp-ta" rows={3} maxLength={3000} value={form.message} onChange={set('message')}
              placeholder={tab === 'inquiry' ? 'What would you like to know?' : tab === 'tour' ? 'Anything we should know before your visit?' : 'Siblings at the centre? Flexible start?'} />
          </label>
          <button type="button" role="checkbox" aria-checked={consent ? 'true' : 'false'} className={`cp-consent ${errors.consent ? 'is-error' : ''}`} onClick={() => { setConsent(!consent); setErrors((current) => ({ ...current, consent: undefined })); }}>
            <span className="cp-consent-box"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
            <span>I agree to share these details with {centre.name} so they can respond. <Link to="/#footer" onClick={(event) => event.stopPropagation()}>Privacy</Link></span>
          </button>
          {errors.consent && <span className="cp-error" role="alert">{errors.consent}</span>}
          {errors.form && <span className="cp-error" role="alert">{errors.form}</span>}
          <button type="button" className="cp-send" onClick={send} disabled={sending}>
            {sending ? 'Sending…' : tab === 'inquiry' ? 'Send question' : tab === 'tour' ? 'Request tour' : 'Join waitlist'}
          </button>
          <span className="cp-note">No account needed · usually replies within a day</span>
        </div>
      )}
    </div>
  );
}

function Lightbox({ centre, mode, index, onIndex, onClose }) {
  const photos = centre.gallery.filter((item) => item.type === 'image');
  const current = photos[index] || null;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (mode === 'gallery' && event.key === 'ArrowRight') onIndex((index + 1) % photos.length);
      if (mode === 'gallery' && event.key === 'ArrowLeft') onIndex((index + photos.length - 1) % photos.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [mode, index, photos.length, onIndex, onClose]);

  const label = mode === 'video' ? (centre.welcome_video?.title || `Welcome to ${centre.name}`) : `Photos · ${centre.name}`;

  return (
    <div className="cp-lightbox" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="cp-lightbox-inner" role="dialog" aria-modal="true" aria-label={label}>
        <div className="cp-lightbox-head"><span>{label}</span><button type="button" aria-label="Close" onClick={onClose}>×</button></div>
        {mode === 'video' ? (
          <div className="cp-lightbox-stage">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={centre.welcome_video.url} controls autoPlay playsInline />
          </div>
        ) : (
          <>
            <div className="cp-lightbox-stage" style={{ backgroundImage: current ? `url(${current.url})` : undefined }} role="img" aria-label={current?.alt_text || current?.caption || 'Centre photo'}>
              {photos.length > 1 && (
                <>
                  <button type="button" className="cp-nav-btn" style={{ left: 16 }} aria-label="Previous photo" onClick={() => onIndex((index + photos.length - 1) % photos.length)}>‹</button>
                  <button type="button" className="cp-nav-btn" style={{ right: 16 }} aria-label="Next photo" onClick={() => onIndex((index + 1) % photos.length)}>›</button>
                </>
              )}
            </div>
            <div className="cp-lightbox-caption">
              <span><strong>{current?.caption || 'Photo'}</strong>{current?.category && ` · ${current.category.label}`}</span>
              <span>{index + 1} / {photos.length}</span>
            </div>
            <div className="cp-thumbs">
              {photos.map((photo, i) => (
                <button key={photo.id} type="button" aria-label={photo.caption || `Photo ${i + 1}`} aria-current={i === index ? 'true' : 'false'} style={{ backgroundImage: `url(${photo.url})` }} onClick={() => onIndex(i)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CentrePublicPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const { data: centre, loading, error, reload } = useResource((signal) => getCentre(slug, undefined, { signal }), [slug]);
  const [lightbox, setLightbox] = useState(null); // { mode, index }
  const [category, setCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(0);
  const [saved, setSaved] = useState(() => readSaved().includes(slug));
  const [shareNote, setShareNote] = useState('');
  useDocumentTitle(centre ? `${centre.name} — Childcare in ${centre.city}` : 'Centre profile');

  useEffect(() => {
    if (centre && params.get('action')) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [centre, params]);

  function toggleSave() {
    const list = new Set(readSaved());
    if (list.has(slug)) list.delete(slug); else list.add(slug);
    try { localStorage.setItem(SAVED_KEY, JSON.stringify([...list])); } catch { /* storage unavailable */ }
    setSaved(list.has(slug));
  }

  async function share() {
    const url = window.location.href.split('?')[0];
    try {
      if (navigator.share) await navigator.share({ title: centre.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setShareNote('Link copied');
        setTimeout(() => setShareNote(''), 2500);
      }
    } catch { /* share cancelled */ }
  }

  if (loading) return <><Header /><PageLoader label="Loading centre…" /></>;
  if (error || !centre) {
    return (
      <>
        <Header />
        <main className="ec-page-state">
          {error?.status === 404
            ? <div className="ec-state"><strong>This centre profile isn’t available</strong><span>It may be unpublished or the link may be wrong.</span><Link className="ec-btn ec-btn-primary" to="/childcare">Search childcare</Link></div>
            : <ErrorState error={error} onRetry={reload} />}
        </main>
      </>
    );
  }

  const art = centreArtFor(centre.slug);
  const photos = centre.gallery.filter((item) => item.type === 'image');
  const cover = photos.find((photo) => photo.is_cover) || photos[0];
  const mosaicPhotos = photos.filter((photo) => photo !== cover).slice(0, 4);
  const categories = [...new Map(photos.filter((p) => p.category).map((p) => [p.category.key, p.category])).values()];
  const strip = photos.filter((photo) => category === 'all' || photo.category?.key === category).slice(0, 4);
  const openPhoto = (photo) => setLightbox({ mode: 'gallery', index: Math.max(0, photos.indexOf(photo)) });
  const fullAddress = [centre.address, centre.city, [centre.province === 'British Columbia' ? 'BC' : centre.province, centre.postal_code].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  const programNames = centre.programs.map((p) => p.name).join(' · ');

  const facts = [
    ['Ages', centre.age_range],
    ['Hours', centre.hours],
    ['Programs', programNames],
    ['Availability', centre.availability?.label, centre.availability?.tone === 'green' ? '#016516' : undefined],
    ['Tuition', centre.tuition_range],
  ].filter(([, value]) => value);

  const anchors = [
    ['overview', 'Overview', true],
    ['programs', 'Programs', centre.programs.length > 0],
    ['media', 'Photos & video', photos.length > 0 || centre.welcome_video],
    ['team', 'Team', centre.team.length > 0],
    ['parents', 'For parents', centre.tuition_info || centre.tour_info || centre.waitlist_info || centre.faqs.length],
    ['location', 'Location', true],
  ].filter(([, , show]) => show);

  return (
    <div className="cp-page">
      <Header />
      <main className="cp-main">
        <div className="cp-wrap">
          <div className="cp-crumbs">
            <span><Link to="/childcare">Find childcare</Link> › <Link to={`/childcare?location=${encodeURIComponent(centre.city)}`} style={{ fontWeight: 500, color: '#5C566A' }}>{centre.city}</Link> › {centre.name}</span>
            <span className="ec-row-flex" style={{ gap: 8 }}>
              <button type="button" className="cp-pill-btn" onClick={share}>{shareNote || 'Share'}</button>
              <button type="button" className="cp-pill-btn" aria-pressed={saved ? 'true' : 'false'} onClick={toggleSave}>{saved ? '♥ Saved' : '♡ Save'}</button>
            </span>
          </div>

          <div className="cp-mosaic" id="photos">
            <PhotoTile
              className="cp-tile-main"
              photo={cover?.url}
              art={art}
              label={centre.welcome_video ? 'Watch the welcome video' : cover?.alt_text || 'Centre photo'}
              onClick={() => (centre.welcome_video ? setLightbox({ mode: 'video' }) : cover && openPhoto(cover))}
            >
              {!cover && <span className="cp-block" />}
              {centre.welcome_video && (
                <span className="cp-watch">
                  <span className="cp-watch-icon"><Icon name="play" size={16} fill="currentColor" strokeWidth={0} /></span>
                  <span className="cp-watch-copy"><strong>Watch our welcome</strong><span>{centre.welcome_video.title || 'Welcome video'}</span></span>
                </span>
              )}
            </PhotoTile>
            {Array.from({ length: 4 }, (_, index) => {
              const photo = mosaicPhotos[index];
              const tileArt = centreArtFor(`${centre.slug}-${index}`);
              const isLast = index === 3 && photos.length > 5;
              return (
                <PhotoTile key={index} photo={photo?.url} art={tileArt} label={photo?.alt_text || photo?.caption || 'Centre photo'} onClick={() => photos.length && (photo ? openPhoto(photo) : setLightbox({ mode: 'gallery', index: 0 }))}>
                  {isLast && <span className="cp-more">+{photos.length - 4} photos</span>}
                </PhotoTile>
              );
            })}
          </div>

          <div className="cp-layout">
            <div className="cp-content">
              <div className="cp-title">
                <span className={`cp-logo tone-${avatarTone(centre.name)}`}>{centre.logo_url ? <img src={centre.logo_url} alt="" /> : centre.initials}</span>
                <div>
                  <h1>{centre.name}</h1>
                  <span className="cp-title-meta">
                    {centre.is_verified && <span className="cp-badge cp-badge-green">✓ Verified centre</span>}
                    {centre.licence_type && <span className="cp-badge cp-badge-blue">Licensed {centre.licence_type.label.toLowerCase()}</span>}
                    <span>{[centre.address, centre.city].filter(Boolean).join(', ')}{centre.distance_km !== null ? ` · ${km(centre.distance_km)} from you` : ''}</span>
                  </span>
                </div>
              </div>

              {facts.length > 0 && (
                <div className="cp-facts" style={{ gridTemplateColumns: `repeat(${Math.min(facts.length, 5)}, minmax(0, 1fr))` }}>
                  {facts.map(([label, value, colour]) => <div className="cp-fact" key={label}><span>{label}</span><span style={{ color: colour }}>{value}</span></div>)}
                </div>
              )}

              <nav className="cp-anchors" aria-label="Profile sections">
                {anchors.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
              </nav>

              <section className="cp-section" id="overview">
                <h2>About us</h2>
                {centre.about ? <p className="cp-lead">{centre.about}</p> : <p className="cp-lead">{centre.name} hasn’t added a description yet.</p>}
                {(centre.philosophy || centre.teaching_approaches.length > 0 || centre.highlights.length > 0) && (
                  <div className="cp-grid-2">
                    {centre.philosophy && <div className="cp-box"><strong>Our philosophy</strong><span>{centre.philosophy}</span></div>}
                    {(centre.teaching_approaches.length > 0 || centre.highlights.length > 0) && (
                      <div className="cp-box" style={{ gap: 8 }}>
                        <strong>Teaching approach</strong>
                        <span className="cp-chips">
                          {centre.teaching_approaches.map((item) => <span className="cp-chip" key={item.key}>{item.label}</span>)}
                          {centre.highlights.map((item) => <span className="cp-chip cp-chip-green" key={item}>{item}</span>)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {centre.daily_schedule.length > 0 && (
                  <div className="cp-box cp-routine">
                    <strong>A day at {centre.name.replace(/\s+(Daycare|Childcare|Centre|Early Learning)$/i, '')}</strong>
                    {centre.daily_schedule.map((row) => (
                      <div className="cp-routine-row" key={`${row.time}-${row.activity}`}><span>{row.time}</span><i /><span>{row.activity}</span></div>
                    ))}
                  </div>
                )}
              </section>

              {centre.programs.length > 0 && (
                <section className="cp-section" id="programs">
                  <h2>Programs</h2>
                  <div className="cp-grid-3">
                    {centre.programs.map((program) => {
                      const [bg, fg] = AVAILABILITY_TONE[program.availability?.key] || AVAILABILITY_TONE.full;
                      return (
                        <div className="cp-program" key={program.id}>
                          <span className="cp-program-head"><strong>{program.name}</strong>{program.availability && <span style={{ background: bg, color: fg }}>{program.availability.label}</span>}</span>
                          {program.age_range && <span className="cp-program-ages">{program.age_range.replace('–', ' – ')}</span>}
                          {program.schedule && <span>{program.schedule.label}</span>}
                          {(program.capacity || program.educator_count) && (
                            <span>{[program.capacity && `${program.capacity} children`, program.educator_count && `${program.educator_count} educators`].filter(Boolean).join(' · ')}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {(photos.length > 0 || centre.welcome_video) && (
                <section className="cp-section" id="media">
                  <div className="cp-section-head">
                    <h2>Photos &amp; video</h2>
                    {photos.length > 0 && <button type="button" className="cp-link-btn" onClick={() => setLightbox({ mode: 'gallery', index: 0 })}>See all {photos.length} photos</button>}
                  </div>
                  <div className="cp-cat-chips">
                    <button type="button" className="cp-cat" aria-pressed={category === 'all' ? 'true' : 'false'} onClick={() => setCategory('all')}>All</button>
                    {categories.map((item) => (
                      <button key={item.key} type="button" className="cp-cat" aria-pressed={category === item.key ? 'true' : 'false'} onClick={() => setCategory(item.key)}>{item.label}</button>
                    ))}
                    {centre.virtual_tour_url && <a className="cp-cat" href={centre.virtual_tour_url} target="_blank" rel="noopener noreferrer">360° virtual tour ↗</a>}
                  </div>
                  <div className="cp-strip">
                    {strip.map((photo) => (
                      <PhotoTile key={photo.id} photo={photo.url} art={art} label={photo.alt_text || photo.caption || 'Centre photo'} onClick={() => openPhoto(photo)}>
                        {photo.caption && <span className="cp-caption">{photo.caption}</span>}
                      </PhotoTile>
                    ))}
                  </div>
                </section>
              )}

              {centre.team.length > 0 && (
                <section className="cp-section" id="team">
                  <h2>Meet the team</h2>
                  <div className="cp-grid-4">
                    {centre.team.map((member) => {
                      const [bg, fg] = TEAM_TONES[avatarTone(member.name)];
                      return (
                        <div className="cp-person" key={member.id}>
                          <span className="cp-person-avatar" style={{ background: bg, color: fg }}>{member.photo_url ? <img src={member.photo_url} alt="" /> : member.initials}</span>
                          <strong>{member.name}</strong>
                          {member.title && <span className="cp-role">{member.title}</span>}
                          {(member.years_experience || member.credentials) && (
                            <span className="cp-meta">{[member.years_experience && `${member.years_experience} yrs`, member.credentials].filter(Boolean).join(' · ')}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {(centre.tuition_info || centre.tour_info || centre.waitlist_info || centre.faqs.length > 0 || centre.resources.length > 0) && (
                <section className="cp-section" id="parents">
                  <h2>For parents</h2>
                  <div className="cp-grid-3">
                    {centre.tuition_info && <div className="cp-box"><strong>Tuition</strong><span>{centre.tuition_info}</span></div>}
                    {centre.tour_info && <div className="cp-box"><strong>Tours</strong><span>{centre.tour_info}</span></div>}
                    {centre.waitlist_info && <div className="cp-box"><strong>Waitlist</strong><span>{centre.waitlist_info}</span></div>}
                  </div>
                  {centre.resources.map((resource) => (
                    <a className="cp-doc" key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" download>
                      <span className="cp-doc-icon">PDF</span>
                      <span className="cp-doc-copy"><strong>{resource.title}</strong>{resource.description && <span>{resource.description}</span>}</span>
                      <span>Download</span>
                    </a>
                  ))}
                  {centre.faqs.length > 0 && (
                    <div className="cp-faqs">
                      {centre.faqs.map((faq, index) => (
                        <div className="cp-faq" key={faq.id}>
                          <button type="button" aria-expanded={openFaq === index ? 'true' : 'false'} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                            {faq.question}<span aria-hidden="true">{openFaq === index ? '−' : '+'}</span>
                          </button>
                          {openFaq === index && <p>{faq.answer}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section className="cp-location" id="location">
                <div className="cp-map">
                  <svg viewBox="0 0 480 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <rect width="480" height="260" fill="#F1EDE6" /><path d="M0 0H160C140 40 90 70 0 90Z" fill="#D6E5EC" /><ellipse cx="380" cy="200" rx="90" ry="50" fill="#DDE9D8" />
                    <path d="M0 150L480 120" stroke="#FFFFFF" strokeWidth="12" /><path d="M220 0L260 260" stroke="#FFFFFF" strokeWidth="12" /><path d="M0 220C150 200 300 190 480 170" stroke="#FFFFFF" strokeWidth="6" fill="none" />
                  </svg>
                  <span className="cp-map-pin" />
                </div>
                <div className="cp-hours">
                  <strong>Location &amp; hours</strong>
                  {fullAddress && <span>{fullAddress}</span>}
                  {centre.hours_full && <span>{centre.hours_full}</span>}
                  {(centre.phone || centre.email) && <span>{[centre.phone, centre.email].filter(Boolean).join(' · ')}</span>}
                  <span className="cp-hours-links">
                    {fullAddress && <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`} target="_blank" rel="noopener noreferrer">Get directions</a>}
                    {centre.website && <><span style={{ color: '#CFC6D6' }}>·</span><a href={/^https?:/.test(centre.website) ? centre.website : `https://${centre.website}`} target="_blank" rel="noopener noreferrer">Website ↗</a></>}
                  </span>
                  {centre.open_roles_count > 0 && (
                    <Link className="cp-hiring" to={`/jobs?keyword=${encodeURIComponent(centre.name)}`}>We’re hiring — {centre.open_roles_count} open {centre.open_roles_count === 1 ? 'role' : 'roles'} →</Link>
                  )}
                </div>
              </section>
            </div>

            <aside className="cp-aside">
              <ContactPanel centre={centre} initialTab={params.get('action')} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      {lightbox && (
        <Lightbox centre={centre} mode={lightbox.mode} index={lightbox.index ?? 0} onIndex={(index) => setLightbox((current) => ({ ...current, index }))} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
