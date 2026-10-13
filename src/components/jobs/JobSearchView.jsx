import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useOptions } from '../../hooks/useOptions.js';
import { useResource } from '../../hooks/useResource.js';
import { applyToJob, saveJob, unsaveJob } from '../../services/educatorApi.js';
import { getJob, searchJobs } from '../../services/publicApi.js';
import { formatShortDate, km, timeAgo } from '../../utils/format.js';
import { Avatar, Button, Checkmark, ErrorState, Icon, Modal, Skeleton } from '../ui/index.jsx';
import '../../pages/educator/find-jobs.css';

const RADII = [5, 10, 25, 50, 100];
const TYPE_TONE = { practicum: 'gold', substitute: 'green', casual: 'green' };
const POSTED = [['', 'Any time'], ['1', 'Last 24 hours'], ['7', 'Last 7 days'], ['30', 'Last 30 days']];

function JobCard({ job, selected, onSelect }) {
  return (
    <button type="button" className="fj-card" aria-pressed={selected ? 'true' : 'false'} onClick={() => onSelect(job.slug)}>
      <span className="fj-card-top">
        <Avatar initials={job.centre?.initials} name={job.centre?.name} size={42} radius={12} src={job.centre?.logo_url} />
        <span className="fj-card-title">
          <strong>{job.title}</strong>
          <span>{[job.centre?.name, km(job.distance_km) || job.city].filter(Boolean).join(' · ')}</span>
        </span>
        {job.is_saved && <Icon name="bookmark" size={16} fill="#42007B" style={{ color: '#42007B' }} />}
      </span>
      <span className="fj-card-tags">
        <span className={`ec-pill ec-pill-sm tone-${TYPE_TONE[job.employment_type?.key] || 'purple'}`}>{job.employment_type?.label}</span>
        {(job.pay || job.employment_type?.key === 'practicum') && (
          <span className="ec-pill ec-pill-sm tone-gray" style={{ fontWeight: 600 }}>{job.pay || 'Unpaid placement'}</span>
        )}
        <span className="fj-posted">{timeAgo(job.published_at)}</span>
      </span>
      {job.has_applied && <span className="fj-applied">✓ Applied</span>}
    </button>
  );
}

function ApplyDialog({ job, user, onClose, onApplied }) {
  const toast = useToast();
  const profile = user?.educator_profile;
  const [note, setNote] = useState('');
  const [share, setShare] = useState({ video: true, certifications: true });
  const [state, setState] = useState('review'); // review | sending | done
  const [error, setError] = useState('');

  async function submit() {
    setState('sending');
    setError('');
    try {
      await applyToJob(job.id, { coverMessage: note, shareVideo: share.video, shareCertifications: share.certifications });
      setState('done');
      onApplied();
    } catch (requestError) {
      setState('review');
      setError(requestError.field('email') ? 'Verify your email address before applying — check your inbox for the link.' : requestError.message);
      if (requestError.status >= 500) toast.error(requestError);
    }
  }

  return (
    <div className="ec-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="ec-modal fj-apply" role="dialog" aria-modal="true" aria-label="Apply">
        {state === 'done' ? (
          <div className="fj-done" role="status">
            <span className="fj-done-icon"><Icon name="check" size={30} strokeWidth={2.6} /></span>
            <h2>Application sent</h2>
            <p>{job.centre?.name} can now see your profile and résumé. We’ll notify you when your status changes.</p>
            <div className="ec-actions" style={{ marginTop: 8, justifyContent: 'center' }}>
              <Button to="/educator/my-jobs">Track my applications</Button>
              <Button variant="outline" onClick={onClose}>Keep browsing</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="fj-apply-head">
              <div><span className="ec-eyebrow">Apply · Review &amp; submit</span><strong>{job.title} — {job.centre?.name}</strong></div>
              <button type="button" className="ec-btn ec-btn-icon" aria-label="Close" onClick={onClose}><Icon name="close" size={16} /></button>
            </div>
            <div className="fj-apply-body">
              <div className="fj-me">
                <Avatar initials={user.initials} name={user.name} size={48} round src={profile?.photo_url} tone="green" />
                <div>
                  <strong>{user.name}</strong>
                  <span>{[profile?.professional_title, profile?.years_experience ? `${profile.years_experience} yrs` : null, profile?.city].filter(Boolean).join(' · ') || 'Complete your profile so centres learn about you'}</span>
                </div>
                <Link to="/educator/profile" style={{ fontSize: 14, fontWeight: 700 }}>Edit profile</Link>
              </div>
              <div className="ec-stack-sm" style={{ gap: 8 }}>
                <span className="fj-apply-label">Résumé</span>
                {profile?.has_resume ? (
                  <div className="fj-file">
                    <span className="fj-file-icon">{(profile.resume_name || '').split('.').pop()?.toUpperCase().slice(0, 4) || 'DOC'}</span>
                    <span><strong>{profile.resume_name || 'Résumé'}</strong><small>Attached from your profile</small></span>
                    <Link to="/educator/profile#resume" style={{ fontSize: 13.5, fontWeight: 700 }}>Replace</Link>
                  </div>
                ) : (
                  <div className="fj-file fj-file-missing">
                    <span className="fj-file-icon">—</span>
                    <span><strong>No résumé yet</strong><small>You can apply now — centres will see your profile.</small></span>
                    <Link to="/educator/profile#resume" style={{ fontSize: 13.5, fontWeight: 700 }}>Upload</Link>
                  </div>
                )}
              </div>
              <div className="ec-stack-sm" style={{ gap: 8 }}>
                <span className="fj-apply-label">Also share with the centre</span>
                {[['video', 'Intro video'], ['certifications', 'Certifications & First Aid']].map(([key, label]) => (
                  <button key={key} type="button" role="checkbox" aria-checked={share[key] ? 'true' : 'false'} className="fj-share" onClick={() => setShare((current) => ({ ...current, [key]: !current[key] }))}>
                    <Checkmark checked={share[key]} />{label}
                  </button>
                ))}
              </div>
              <label className="ec-label">Note to the centre <span className="ec-hint">(optional)</span>
                <textarea className="ec-textarea" rows={3} maxLength={5000} placeholder="Why you’d be a great fit…" value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
              {error && <div className="ec-alert ec-alert-error" role="alert">{error}</div>}
            </div>
            <div className="fj-apply-foot">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={submit} loading={state === 'sending'}>{state === 'sending' ? 'Submitting…' : 'Submit application'}</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function JobDetail({ slug, listJob, viewer, onBack, onChange }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: job, loading, error, reload, setData } = useResource((signal) => getJob(slug, { signal }), [slug]);
  const [applying, setApplying] = useState(false);
  const isEducator = viewer?.role === 'educator';
  const isGuest = !viewer;

  if (loading && !job) {
    return <article className="fj-detail" aria-busy="true"><div className="fj-detail-head"><Skeleton height={54} /><Skeleton height={60} /><Skeleton height={50} /></div><div className="fj-detail-body"><Skeleton height={120} /></div></article>;
  }
  if (error) return <article className="fj-detail"><ErrorState error={error} onRetry={reload} /></article>;
  if (!job) return null;

  const saved = job.is_saved ?? listJob?.is_saved;
  const applied = job.has_applied ?? listJob?.has_applied;
  const requireSignIn = () => navigate(`/signin?next=${encodeURIComponent(`/educator/jobs?job=${job.slug}`)}`);

  async function toggleSave() {
    if (isGuest) return requireSignIn();
    const next = !saved;
    setData((current) => ({ ...current, is_saved: next }));
    onChange(job.slug, { is_saved: next });
    try {
      if (next) await saveJob(job.id); else await unsaveJob(job.id);
    } catch (requestError) {
      setData((current) => ({ ...current, is_saved: !next }));
      onChange(job.slug, { is_saved: !next });
      toast.error(requestError);
    }
  }

  const requirements = [
    job.required_education?.label,
    ...job.required_certifications.map((item) => item.label).filter((label) => label !== job.required_education?.label),
    job.experience_level?.label,
    job.practicum_hours ? `${job.practicum_hours} practicum hours` : null,
  ].filter(Boolean);

  return (
    <article className="fj-detail" aria-label={job.title}>
      <div className="fj-detail-head">
        <button type="button" className="ec-btn ec-btn-secondary ec-btn-xs fj-back" onClick={onBack}><Icon name="arrowLeft" size={14} /> All jobs</button>
        <div className="fj-detail-title">
          <Avatar initials={job.centre?.initials} name={job.centre?.name} size={54} radius={15} src={job.centre?.logo_url} />
          <div>
            <h2>{job.title}</h2>
            {job.centre?.is_public
              ? <Link to={`/childcare/${job.centre.slug}`}>{job.centre.name}{job.centre.is_verified && <span style={{ color: '#016516' }}> · Verified centre</span>}</Link>
              : <span style={{ fontSize: 14.5, fontWeight: 600 }}>{job.centre?.name}</span>}
          </div>
        </div>
        <div className="ec-facts fj-facts">
          <div className="ec-fact"><span>Type</span><span>{job.employment_type?.label || '—'}</span></div>
          <div className="ec-fact"><span>Pay</span><span>{job.pay || (job.employment_type?.key === 'practicum' ? 'Unpaid' : 'Not listed')}</span></div>
          <div className="ec-fact"><span>Distance</span><span>{km(job.distance_km ?? listJob?.distance_km) || job.city}</span></div>
          <div className="ec-fact"><span>Start</span><span>{job.start_date ? formatShortDate(job.start_date) : 'Flexible'}</span></div>
        </div>
        <div className="fj-detail-actions">
          {applied ? (
            <Link className="fj-applied-link" to="/educator/my-jobs">✓ Applied — track status</Link>
          ) : isEducator || isGuest ? (
            <Button size={undefined} style={{ height: 50, padding: '0 28px', fontSize: 15.5 }} disabled={!job.accepting_applications}
              onClick={() => (isGuest ? requireSignIn() : setApplying(true))}>
              {job.accepting_applications ? 'Apply with my profile' : 'Applications closed'}
            </Button>
          ) : null}
          {(isEducator || isGuest) && (
            <button type="button" className="fj-save" aria-pressed={saved ? 'true' : 'false'} onClick={toggleSave}>
              <Icon name="bookmark" size={16} fill={saved ? '#42007B' : 'none'} />{saved ? 'Saved' : 'Save'}
            </button>
          )}
          {job.application_deadline && <span className="fj-deadline">Apply by {formatShortDate(job.application_deadline)}</span>}
        </div>
      </div>
      <div className="fj-detail-body">
        {job.description && <div><h3>About the role</h3><p>{job.description}</p></div>}
        {job.responsibilities.length > 0 && (
          <div><h3>Responsibilities</h3><ul>{job.responsibilities.map((line) => <li key={line}>{line}</li>)}</ul></div>
        )}
        {(requirements.length > 0 || job.benefits.length > 0) && (
          <div className="ec-grid-2" style={{ gap: 20 }}>
            {requirements.length > 0 && <div><h3>Requirements</h3><ul>{requirements.map((line) => <li key={line}>{line}</li>)}</ul></div>}
            {job.benefits.length > 0 && <div><h3>Benefits</h3><ul>{job.benefits.map((line) => <li key={line}>{line}</li>)}</ul></div>}
          </div>
        )}
        {job.application_instructions && <div><h3>How to apply</h3><p>{job.application_instructions}</p></div>}
        {job.centre?.is_public && (
          <Link className="fj-meet" to={`/childcare/${job.centre.slug}`}>
            <span className="fj-meet-thumb"><Icon name="play" size={18} fill="currentColor" strokeWidth={0} /></span>
            <span className="fj-meet-copy"><strong>Meet {job.centre.name}</strong><span>{job.centre.has_welcome_video ? 'Welcome video, programs, team and gallery' : 'Programs, team, photos and more'}</span></span>
            <span>View centre →</span>
          </Link>
        )}
      </div>
      {applying && (
        <ApplyDialog
          job={job}
          user={viewer}
          onClose={() => setApplying(false)}
          onApplied={() => { setData((current) => ({ ...current, has_applied: true })); onChange(job.slug, { has_applied: true }); }}
        />
      )}
    </article>
  );
}

/**
 * Find jobs: search bar, filters, results and detail pane. Used by the educator
 * workspace (/educator/jobs) and the public job board (/jobs).
 */
export default function JobSearchView() {
  const { user } = useAuth();
  const options = useOptions();
  const geo = useGeolocation();
  const [params, setParams] = useSearchParams();
  const profile = user?.educator_profile;
  const profileHasGeo = profile?.latitude != null && profile?.longitude != null;

  const filters = useMemo(() => ({
    keyword: params.get('keyword') || '',
    location: params.get('location') || '',
    latitude: params.get('latitude') || (!params.get('location') && profileHasGeo ? profile.latitude : ''),
    longitude: params.get('longitude') || (!params.get('location') && profileHasGeo ? profile.longitude : ''),
    radius: Number(params.get('radius')) || profile?.search_radius_km || 25,
    employment_types: (params.get('employment_types') || '').split(',').filter(Boolean),
    category: params.get('category') || '',
    posted_within: params.get('posted_within') || '',
    practicum_only: params.has('practicum') ? params.get('practicum') === '1' : Boolean(profile?.practicum_mode),
    sort: params.get('sort') || 'closest',
  }), [params, profile, profileHasGeo]);

  const hasGeo = Boolean(filters.latitude && filters.longitude);
  const defaultLocationLabel = params.get('location') || (params.get('latitude') ? 'Current location' : profileHasGeo ? [profile.postal_code, profile.city].filter(Boolean).join(', ') : '');
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [locationInput, setLocationInput] = useState(defaultLocationLabel);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);

  useEffect(() => { setKeywordInput(filters.keyword); }, [filters.keyword]);
  useEffect(() => { setLocationInput(defaultLocationLabel); }, [defaultLocationLabel]);

  const query = {
    keyword: filters.keyword,
    location: hasGeo ? undefined : filters.location,
    latitude: hasGeo ? filters.latitude : undefined,
    longitude: hasGeo ? filters.longitude : undefined,
    radius: hasGeo ? filters.radius : undefined,
    employment_types: filters.practicum_only ? ['practicum'] : filters.employment_types,
    category: filters.category,
    posted_within: filters.posted_within,
    sort: hasGeo ? filters.sort : 'newest',
    per_page: 20,
  };
  const queryKey = JSON.stringify(query);

  const { data, meta, loading, error, reload } = useResource((signal) => searchJobs({ ...query, page }, { signal }), [queryKey, page, user?.id]);

  useEffect(() => { setPage(1); setPages([]); }, [queryKey]);
  useEffect(() => {
    if (!data) return;
    setPages((current) => {
      const next = [...current];
      next[page - 1] = data;
      return next.slice(0, page);
    });
  }, [data, page]);

  const jobs = pages.flat();
  const selectedSlug = params.get('job') || params.get('slug') || null;
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 761px)').matches;
  const activeSlug = selectedSlug || (isDesktop ? jobs[0]?.slug : null);
  const facets = meta?.facets?.employment_types || {};
  const typeOptions = options.employment_types || [];

  function update(changes, { keepJob = false } = {}) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || (Array.isArray(value) && !value.length)) next.delete(key);
      else next.set(key, Array.isArray(value) ? value.join(',') : String(value));
    });
    if (!keepJob) next.delete('job');
    setParams(next);
  }

  function patchJob(slug, changes) {
    setPages((current) => current.map((pageJobs) => pageJobs.map((job) => (job.slug === slug ? { ...job, ...changes } : job))));
  }

  function submitSearch(event) {
    event.preventDefault();
    const location = locationInput.trim();
    const changes = { keyword: keywordInput.trim() };
    if (location !== defaultLocationLabel) Object.assign(changes, { location, latitude: '', longitude: '' });
    update(changes);
  }

  async function nearMe() {
    const coords = await geo.locate();
    if (coords) update({ ...coords, location: '' });
  }

  function toggleType(key) {
    const set = new Set(filters.employment_types);
    if (set.has(key)) set.delete(key); else set.add(key);
    update({ employment_types: [...set], practicum: '0' });
  }

  const locationSummary = hasGeo ? `within ${filters.radius} km${defaultLocationLabel ? ` of ${defaultLocationLabel.split(',')[0]}` : ''}` : filters.location ? `in ${filters.location}` : 'across Canada';

  return (
    <>
      <div className="fj-searchbar">
        <form className="fj-search" role="search" onSubmit={submitSearch}>
          <label className="fj-input fj-input-keyword">
            <Icon name="search" size={18} strokeWidth={2.2} />
            <input type="text" aria-label="Job title or keyword" placeholder={filters.practicum_only ? 'Program, level or centre' : 'Job title or keyword'} value={keywordInput} onChange={(event) => setKeywordInput(event.target.value)} />
          </label>
          <label className="fj-input fj-input-location">
            <Icon name="pin" size={18} />
            <input type="text" aria-label="City or postal code" placeholder="City or postal code" value={locationInput} onChange={(event) => setLocationInput(event.target.value)} />
            <button type="button" className="fj-near" aria-label="Use my current location" onClick={nearMe} disabled={geo.loading}>{geo.loading ? '…' : 'Near me'}</button>
          </label>
          <div className="fj-radii" role="radiogroup" aria-label="Distance">
            {RADII.map((radius) => (
              <button key={radius} type="button" role="radio" aria-checked={filters.radius === radius ? 'true' : 'false'} onClick={() => update({ radius })}>{radius} km</button>
            ))}
          </div>
          <button type="submit" className="fj-submit">Search</button>
        </form>
      </div>

      <div className="fj-body">
        <div className={`fj-grid ${selectedSlug ? 'has-selection' : ''}`}>
          <aside className="fj-filters" aria-label="Filters">
            <button type="button" role="switch" aria-checked={filters.practicum_only ? 'true' : 'false'} className="fj-practicum" onClick={() => update({ practicum: filters.practicum_only ? '0' : '1' })}>
              <span className="fj-practicum-track" />
              <span className="fj-practicum-copy"><strong>Practicum mode</strong><span>Show placements only</span></span>
            </button>
            <fieldset className="fj-fieldset">
              <legend className="fj-legend">Employment type</legend>
              {typeOptions.map((type) => {
                const on = filters.practicum_only ? type.key === 'practicum' : filters.employment_types.includes(type.key);
                return (
                  <button key={type.key} type="button" role="checkbox" aria-checked={on ? 'true' : 'false'} className="fj-check" onClick={() => toggleType(type.key)}>
                    <Checkmark checked={on} />
                    <span className="fj-check-label">{type.label}</span>
                    <span className="fj-check-count">{facets[type.key] ?? ''}</span>
                  </button>
                );
              })}
            </fieldset>
            <label className="fj-select-label">Job category
              <select value={filters.category} onChange={(event) => update({ category: event.target.value })}>
                <option value="">All categories</option>
                {(options.job_categories || []).map((category) => <option key={category.key} value={category.key}>{category.label}</option>)}
              </select>
            </label>
            <label className="fj-select-label">Date posted
              <select value={filters.posted_within} onChange={(event) => update({ posted_within: event.target.value })}>
                {POSTED.map(([value, label]) => <option key={label} value={value}>{label}</option>)}
              </select>
            </label>
            <button type="button" className="fj-clear" onClick={() => setParams(new URLSearchParams())}>Clear filters</button>
          </aside>

          <section className="fj-results" aria-label="Results" aria-busy={loading}>
            <div className="fj-results-head">
              <span><strong>{loading && !jobs.length ? '…' : `${meta?.total ?? 0} ${meta?.total === 1 ? 'job' : 'jobs'}`}</strong> {locationSummary}</span>
              {hasGeo && (
                <label className="fj-sort">Sort
                  <select value={filters.sort} onChange={(event) => update({ sort: event.target.value }, { keepJob: true })}>
                    <option value="closest">Closest</option>
                    <option value="newest">Newest</option>
                  </select>
                </label>
              )}
            </div>
            {geo.error && <div className="ec-alert ec-alert-warning" role="alert">{geo.error}</div>}
            {error && <div className="fj-empty"><ErrorState error={error} onRetry={reload} /></div>}
            {!error && loading && !jobs.length && [0, 1, 2, 3].map((key) => <Skeleton key={key} height={112} style={{ borderRadius: 16 }} />)}
            {!error && jobs.map((job) => (
              <JobCard key={job.id} job={job} selected={job.slug === activeSlug} onSelect={(slug) => update({ job: slug }, { keepJob: true })} />
            ))}
            {!error && !loading && jobs.length === 0 && <div className="fj-empty">No jobs match these filters. Try a larger distance or fewer filters.</div>}
            {meta && meta.current_page < meta.last_page && (
              <Button variant="secondary" size="sm" className="fj-more" loading={loading} onClick={() => setPage((current) => current + 1)}>Load more jobs</Button>
            )}
          </section>

          {activeSlug ? (
            <JobDetail
              key={activeSlug}
              slug={activeSlug}
              listJob={jobs.find((job) => job.slug === activeSlug)}
              viewer={user}
              onBack={() => update({ job: '' })}
              onChange={patchJob}
            />
          ) : (!loading && jobs.length === 0 ? null : <span />)}
        </div>
      </div>
    </>
  );
}

