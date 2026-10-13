import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useBlocker, useNavigate, useParams } from 'react-router-dom';
import { Button, ErrorState, Icon, Modal, PageLoader, Pill } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { getCentreProfile } from '../../services/centreApi.js';
import { centreArtFor } from '../../utils/centreArt.js';
import { timeAgo } from '../../utils/format.js';
import AboutStep from './profile-steps/AboutStep.jsx';
import BasicsStep from './profile-steps/BasicsStep.jsx';
import MediaStep from './profile-steps/MediaStep.jsx';
import ParentsStep from './profile-steps/ParentsStep.jsx';
import ProgramsStep from './profile-steps/ProgramsStep.jsx';
import ReviewStep, { STEP_DEFS } from './profile-steps/ReviewStep.jsx';
import TeamStep from './profile-steps/TeamStep.jsx';
import './profile-builder.css';

const STEPS = { basics: BasicsStep, about: AboutStep, programs: ProgramsStep, media: MediaStep, team: TeamStep, parents: ParentsStep, review: ReviewStep };
const TIPS = {
  basics: ['Use the address families will drive to.', 'Your licence number is never shown publicly.'],
  about: ['Write like you’d talk to a parent on a tour.', 'Keep “About us” to 3–4 sentences.'],
  programs: ['Keep availability current — it’s the first thing parents filter by.', 'Tuition is optional, but families appreciate knowing.'],
  media: ['Shoot in daylight, horizontally.', 'Add alt text so every family can enjoy your gallery.', 'Your director’s welcome video is the most-watched item on profiles.'],
  team: ['Photos of your educators build trust before the first visit.', 'Credentials like ECE, IT and SN help families understand your team.'],
  parents: ['Answer the questions you hear most on tours.', 'A parent handbook saves you time answering the same questions.'],
  review: ['Your live profile stays visible while changes are reviewed.'],
};

function SearchPreview({ centre }) {
  const art = centreArtFor(centre.slug);
  const tags = centre.programs?.length ? centre.programs.map((program) => program.name).slice(0, 3) : [];
  return (
    <div className="cb-preview">
      <div className="cb-preview-art" style={{ backgroundColor: art.background, backgroundImage: centre.cover_url ? `url(${centre.cover_url})` : undefined }}>
        {!centre.cover_url && <><span className="cp-orb" style={{ background: art.orb }} /><span className="cp-sun" style={{ background: art.sun }} /></>}
        {centre.welcome_video && <span className="cb-preview-chip" style={{ left: 12, top: 12, background: 'rgba(23,18,31,.55)', color: '#fff' }}>▶ Welcome video</span>}
        {centre.photo_count > 0 && <span className="cb-preview-chip" style={{ right: 12, bottom: 12, background: '#fff', color: '#17121F' }}>{centre.photo_count} photos</span>}
      </div>
      <div className="cb-preview-body">
        <strong>{centre.name}</strong>
        <span>{[centre.is_verified ? '✓ Verified' : null, centre.licence_type ? `Licensed ${centre.licence_type.label.toLowerCase()}` : null, centre.city].filter(Boolean).join(' · ')}</span>
        {tags.length > 0 && <div className="ec-row-flex ec-wrap" style={{ gap: 6 }}>{tags.map((tag) => <span key={tag} className="ec-pill ec-pill-sm tone-purple">{tag}</span>)}</div>}
        {centre.availability && <span style={{ color: centre.availability.tone === 'green' ? '#016516' : '#7A5A00', fontWeight: 700, fontSize: 13.5 }}>{centre.availability.label}</span>}
      </div>
    </div>
  );
}

export default function CentreProfileBuilderPage() {
  const { step } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, refresh } = useAuth();
  const { data: centre, loading, error, reload, setData } = useResource((signal) => getCentreProfile({ signal }), []);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [saving, setSaving] = useState(false);
  const saveRef = useRef(async () => true);
  const stepIndex = STEP_DEFS.findIndex(([key]) => key === step);
  useDocumentTitle(stepIndex >= 0 ? `Centre profile · ${STEP_DEFS[stepIndex][1]}` : 'Centre profile');

  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const registerSave = useCallback((fn) => { saveRef.current = fn; return undefined; }, []);
  const onSaved = useCallback((updated) => {
    setData(updated);
    setSavedAt(new Date().toISOString());
    refresh();
  }, [setData, refresh]);

  async function saveCurrent() {
    setSaving(true);
    const ok = await saveRef.current();
    setSaving(false);
    if (ok && step !== 'review') toast.success('All changes saved.');
    return ok;
  }

  async function goTo(key) {
    if (key === step) return;
    if (dirty && !(await saveCurrent())) return;
    setDirty(false);
    navigate(`/centre/profile/${key}`);
  }

  if (stepIndex < 0) return <Navigate to="/centre/profile/basics" replace />;
  if (loading && !centre) return <PageLoader label="Loading your centre profile…" />;
  if (error && !centre) return <main className="ec-main"><div className="ec-container"><ErrorState error={error} onRetry={reload} /></div></main>;

  const live = centre.is_published && centre.status === 'published';
  const StepComponent = STEPS[step];
  const next = STEP_DEFS[stepIndex + 1];
  const previous = STEP_DEFS[stepIndex - 1];
  const statusPill = live ? ['green', 'Published · editing'] : centre.status === 'pending_review' ? ['yellow', 'In review'] : ['gray', 'Draft'];

  return (
    <>
      <div className="cb-header">
        <div className="cb-header-inner">
          <h1>Centre profile</h1>
          <Pill size="sm" tone={statusPill[0]}>{statusPill[1]}</Pill>
          <span className={`cb-saved ${dirty ? 'is-dirty' : ''}`}>{dirty ? 'Unsaved changes' : savedAt ? `All changes saved · ${timeAgo(savedAt).toLowerCase()}` : 'All changes saved'}</span>
          <span style={{ flexGrow: 1 }} />
          <Button variant="outline" to={live ? `/childcare/${centre.slug}` : undefined} disabled={!live} title={live ? undefined : 'Available once your profile is published'}>
            <Icon name="eye" size={16} />Preview as a parent
          </Button>
          <Button variant="outline" onClick={saveCurrent} loading={saving} disabled={step === 'review'}>Save draft</Button>
          <Button onClick={() => goTo('review')}>Review &amp; publish</Button>
        </div>
      </div>

      <main className="cb-main">
        <div className="cb-grid">
          <nav className="cb-stepper" aria-label="Profile steps">
            <div className="cb-strength">
              <div>Profile strength <span>{centre.completion.percent}%</span></div>
              <i><b style={{ width: `${centre.completion.percent}%` }} /></i>
            </div>
            {STEP_DEFS.map(([key, label, description], index) => {
              const done = key !== 'review' && centre.completion.steps[key]?.complete;
              return (
                <button key={key} type="button" className={`cb-step ${done ? 'is-done' : ''}`} aria-current={key === step ? 'step' : undefined} onClick={() => goTo(key)}>
                  <span className="cb-step-dot">{done ? <Icon name="check" size={14} strokeWidth={3} /> : index + 1}</span>
                  <span><strong>{label}</strong><small>{description}</small></span>
                </button>
              );
            })}
          </nav>

          <div className="cb-content">
            <StepComponent key={step} centre={centre} user={user} onSaved={onSaved} registerSave={registerSave} setDirty={setDirty} onEdit={goTo} />
            {step !== 'review' && (
              <div className="cb-nav">
                {previous ? <Button variant="outline" onClick={() => goTo(previous[0])}>← {previous[1]}</Button> : <span />}
                <Button loading={saving} onClick={async () => { if (await saveCurrent()) { setDirty(false); navigate(`/centre/profile/${next[0]}`); } }}>
                  Save &amp; continue: {next[1]} →
                </Button>
              </div>
            )}
            {step === 'review' && previous && <div className="cb-nav"><Button variant="outline" onClick={() => goTo(previous[0])}>← {previous[1]}</Button></div>}
          </div>

          <aside className="cb-side">
            <div className="ec-stack-sm" style={{ gap: 10 }}>
              <span className="ec-eyebrow">How families see you in search</span>
              <SearchPreview centre={centre} />
            </div>
            <div className="cb-tips">
              <strong>Tips for this step</strong>
              <ul>{TIPS[step].map((tip) => <li key={tip}>{tip}</li>)}</ul>
            </div>
          </aside>
        </div>
      </main>

      <Modal open={blocker.state === 'blocked'} title="Save your changes?" onClose={() => blocker.reset?.()}
        footer={(
          <>
            <Button variant="outline" onClick={() => { setDirty(false); blocker.proceed?.(); }}>Discard</Button>
            <Button onClick={async () => { if (await saveCurrent()) { setDirty(false); blocker.proceed?.(); } else blocker.reset?.(); }}>Save &amp; leave</Button>
          </>
        )}>
        <p className="ec-muted" style={{ margin: 0 }}>You have unsaved changes on this step.</p>
      </Modal>
    </>
  );
}
