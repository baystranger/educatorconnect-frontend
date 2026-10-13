import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, ChoiceChips, ErrorState, Field, Icon, Input, Modal, PageLoader, Select, Textarea } from '../../components/ui/index.jsx';
import TagInput from '../../components/ui/TagInput.jsx';
import VideoRecorder from '../../components/ui/VideoRecorder.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useOptions } from '../../hooks/useOptions.js';
import { useResource } from '../../hooks/useResource.js';
import {
  addCredential, deleteCredential, downloadMyResume, getMyProfile, removeProfileMedia, updateCredential,
  updateMyProfile, uploadProfileMedia,
} from '../../services/educatorApi.js';
import { fileSize, formatLongDate, toDate } from '../../utils/format.js';
import './educator-profile.css';

const PREFERENCES = [['full_time', 'Full-time'], ['part_time', 'Part-time'], ['casual', 'Casual'], ['substitute', 'Substitute'], ['contract', 'Contract'], ['leadership', 'Leadership'], ['management', 'Management']];
const AGE_GROUPS = ['Infants (0–18 mo)', 'Toddlers (18 mo–3 yrs)', 'Preschool (3–5 yrs)', 'School age (5–12 yrs)'];
const AVAILABILITY = ['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings', 'On-call'];
const VISIBILITY = [
  ['public', 'Public', 'Anyone can find your profile in search.'],
  ['verified_centres', 'Verified centres only', 'Centres can find you and see your full profile.'],
  ['applied_only', 'Only centres I apply to', 'Hidden from search.'],
];
const BADGE_TONES = { Verified: ['#E8F3EA', '#016516'], Current: ['#F4EFFA', '#42007B'], Pending: ['#FFF6D6', '#7A5A00'], Expired: ['#FDEBE4', '#B42318'], Education: ['#F4F2F6', '#3A3346'] };
const CHIP_TONES = {
  age_groups_preferred: ['#F4EFFA', '#42007B'],
  areas_of_expertise: ['#E8F3EA', '#016516'],
  special_interests: ['#FFF6D6', '#7A5A00'],
  professional_development: ['#F4F2F6', '#3A3346'],
};

/** Hidden file input wrapper so any button can open a picker. */
function useFilePicker(accept, onPick) {
  const ref = useRef(null);
  const input = (
    <input ref={ref} type="file" accept={accept} hidden onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) onPick(file); }} />
  );
  return [input, () => ref.current?.click()];
}

function CredentialModal({ credential, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState({
    kind: credential?.kind || 'certification',
    title: credential?.title || '',
    issuer: credential?.issuer || '',
    issued_on: credential?.issued_on || '',
    expires_on: credential?.expires_on || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function save() {
    setSaving(true);
    setErrors({});
    const payload = { ...form, issued_on: form.issued_on || null, expires_on: form.expires_on || null, issuer: form.issuer || null };
    try {
      const response = credential ? await updateCredential(credential.id, payload) : await addCredential(payload);
      toast.success(response.message);
      onSaved();
    } catch (error) {
      setErrors(Object.fromEntries(Object.entries(error.errors || {}).map(([key, value]) => [key, value[0]])));
      if (!error.errors || !Object.keys(error.errors).length) toast.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open title={credential ? 'Edit credential' : 'Add a certification or education'} onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} loading={saving} disabled={!form.title.trim()}>Save</Button></>}>
      <ChoiceChips label="Type" value={form.kind} onChange={(kind) => setForm((current) => ({ ...current, kind }))}
        options={[{ key: 'certification', label: 'Certification' }, { key: 'education', label: 'Education' }]} />
      <Field label={form.kind === 'education' ? 'Program or degree' : 'Certificate'} error={errors.title}>
        <Input value={form.title} onChange={set('title')} placeholder={form.kind === 'education' ? 'Diploma, Early Childhood Care & Education' : 'Early Childhood Educator Certificate'} maxLength={150} invalid={errors.title} />
      </Field>
      <Field label={form.kind === 'education' ? 'School' : 'Issued by'} hint="optional" error={errors.issuer}>
        <Input value={form.issuer} onChange={set('issuer')} placeholder={form.kind === 'education' ? 'Douglas College' : 'BC ECE Registry'} maxLength={150} />
      </Field>
      <div className="ec-grid-2">
        <Field label={form.kind === 'education' ? 'Graduated' : 'Issued'} hint="optional" error={errors.issued_on}><Input type="date" value={form.issued_on} onChange={set('issued_on')} /></Field>
        {form.kind === 'certification' && <Field label="Valid until" hint="optional" error={errors.expires_on}><Input type="date" value={form.expires_on} onChange={set('expires_on')} /></Field>}
      </div>
      {credential?.verification_status === 'verified' && <p className="ec-muted" style={{ margin: 0, fontSize: 13.5 }}>Changing a verified credential sends it back for verification.</p>}
    </Modal>
  );
}

function DetailsModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    first_name: profile.first_name, last_name: profile.last_name, professional_title: profile.professional_title || '',
    years_experience: profile.years_experience ?? '', languages: profile.languages, city: profile.city || '',
    province: profile.province || '', postal_code: profile.postal_code || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <Modal open title="Your details" onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={saving} onClick={async () => { setSaving(true); await onSave({ ...form, years_experience: form.years_experience === '' ? null : Number(form.years_experience) }); setSaving(false); }}>Save</Button></>}>
      <div className="ec-grid-2">
        <Field label="First name"><Input value={form.first_name} onChange={set('first_name')} maxLength={100} /></Field>
        <Field label="Last name"><Input value={form.last_name} onChange={set('last_name')} maxLength={100} /></Field>
      </div>
      <Field label="Role or title"><Input value={form.professional_title} onChange={set('professional_title')} placeholder="Infant / Toddler Educator" maxLength={120} /></Field>
      <div className="ec-grid-2">
        <Field label="Years of experience"><Input type="number" min={0} max={60} value={form.years_experience} onChange={set('years_experience')} /></Field>
        <Field label="Postal code"><Input value={form.postal_code} onChange={set('postal_code')} maxLength={20} /></Field>
      </div>
      <div className="ec-grid-2">
        <Field label="City"><Input value={form.city} onChange={set('city')} maxLength={100} /></Field>
        <Field label="Province / territory"><Input value={form.province} onChange={set('province')} maxLength={100} /></Field>
      </div>
      <Field label="Languages"><TagInput label="Languages" value={form.languages} onChange={(languages) => setForm((current) => ({ ...current, languages }))} suggestions={['English', 'French']} /></Field>
    </Modal>
  );
}

function SkillsModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    age_groups_preferred: profile.age_groups_preferred, areas_of_expertise: profile.areas_of_expertise,
    special_interests: profile.special_interests, professional_development: profile.professional_development,
  });
  const [saving, setSaving] = useState(false);
  const field = (key, label, suggestions) => (
    <Field label={label}><TagInput label={label} value={form[key]} onChange={(value) => setForm((current) => ({ ...current, [key]: value }))} suggestions={suggestions} /></Field>
  );
  return (
    <Modal open title="Skills & experience" onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={saving} onClick={async () => { setSaving(true); await onSave(form); setSaving(false); }}>Save</Button></>}>
      {field('age_groups_preferred', 'Age groups', AGE_GROUPS)}
      {field('areas_of_expertise', 'Areas of expertise', ['Primary caregiving', 'Emergent curriculum', 'Inclusion support', 'Outdoor learning'])}
      {field('special_interests', 'Special interests', ['Music & movement', 'Art', 'Outdoor sensory play', 'Literacy'])}
      {field('professional_development', 'Professional development', [])}
    </Modal>
  );
}

function PreferencesModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({ availability: profile.availability, available_from: profile.available_from || '', search_radius_km: profile.search_radius_km, open_to_relocation: profile.open_to_relocation });
  const [saving, setSaving] = useState(false);
  return (
    <Modal open title="Availability & search" onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={saving} onClick={async () => { setSaving(true); await onSave({ ...form, available_from: form.available_from || null, search_radius_km: Number(form.search_radius_km) }); setSaving(false); }}>Save</Button></>}>
      <Field label="Availability"><ChoiceChips multiple label="Availability" value={form.availability} onChange={(availability) => setForm((current) => ({ ...current, availability }))} options={AVAILABILITY.map((item) => ({ key: item, label: item }))} /></Field>
      <div className="ec-grid-2">
        <Field label="Can start"><Input type="date" value={form.available_from} onChange={(event) => setForm((current) => ({ ...current, available_from: event.target.value }))} /></Field>
        <Field label="Search radius">
          <Select value={form.search_radius_km} onChange={(event) => setForm((current) => ({ ...current, search_radius_km: event.target.value }))} options={[5, 10, 25, 50, 100].map((km) => ({ key: km, label: `${km} km` }))} />
        </Field>
      </div>
    </Modal>
  );
}

function StudentModal({ profile, options, onClose, onSave }) {
  const [form, setForm] = useState({ ...profile.student });
  const [saving, setSaving] = useState(false);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  return (
    <Modal open title="ECE student information" onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button loading={saving} onClick={async () => {
        setSaving(true);
        const clean = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value === '' ? null : value]));
        await onSave({ student: { ...clean, enabled: true, required_practicum_hours: clean.required_practicum_hours ? Number(clean.required_practicum_hours) : null } });
        setSaving(false);
      }}>Save</Button></>}>
      <Field label="College or university"><Input value={form.college_university || ''} onChange={set('college_university')} maxLength={150} /></Field>
      <Field label="Program"><Input value={form.program || ''} onChange={set('program')} maxLength={150} /></Field>
      <div className="ec-grid-2">
        <Field label="Practicum level"><Select value={form.practicum_level || ''} onChange={set('practicum_level')} placeholder="Select" options={options.practicum_levels || []} /></Field>
        <Field label="Required hours"><Input type="number" min={1} value={form.required_practicum_hours || ''} onChange={set('required_practicum_hours')} /></Field>
      </div>
      <div className="ec-grid-2">
        <Field label="Practicum starts"><Input type="date" value={form.practicum_start_date || ''} onChange={set('practicum_start_date')} /></Field>
        <Field label="Practicum ends"><Input type="date" value={form.practicum_end_date || ''} onChange={set('practicum_end_date')} /></Field>
      </div>
      <Field label="Expected graduation"><Input type="date" value={form.expected_graduation_date || ''} onChange={set('expected_graduation_date')} /></Field>
    </Modal>
  );
}

function EditableText({ title, value, placeholder, hint, onSave, emptyTitle, emptyText, id }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const [saving, setSaving] = useState(false);
  useEffect(() => setDraft(value || ''), [value]);

  if (!value && !editing) {
    return (
      <section className="ep-section ep-add-row" id={id}>
        <span className="ep-add-icon">+</span>
        <span className="ep-add-copy"><strong>{emptyTitle}</strong><span>{emptyText}</span></span>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)} style={{ color: '#42007B' }}>Add</Button>
      </section>
    );
  }

  return (
    <section className="ep-section" id={id}>
      <div className="ep-section-head">
        <h2>{title}</h2>
        {!editing && <button type="button" className="ep-edit" onClick={() => setEditing(true)}>Edit</button>}
      </div>
      {editing ? (
        <div className="ec-stack-sm" style={{ gap: 10 }}>
          <Textarea rows={5} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} aria-label={title} maxLength={3000} autoFocus />
          <div className="ec-row-flex" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <span className="ec-muted" style={{ fontSize: 13 }}>{hint}</span>
            <span className="ec-row-flex" style={{ gap: 8 }}>
              <Button size="sm" variant="outline" onClick={() => { setDraft(value || ''); setEditing(false); }}>Cancel</Button>
              <Button size="sm" loading={saving} onClick={async () => { setSaving(true); const ok = await onSave(draft.trim()); setSaving(false); if (ok) setEditing(false); }}>Save</Button>
            </span>
          </div>
        </div>
      ) : <p className="ep-text">{value}</p>}
    </section>
  );
}

export default function EducatorProfilePage() {
  useDocumentTitle('My profile');
  const { refresh } = useAuth();
  const toast = useToast();
  const options = useOptions();
  const { hash } = useLocation();
  const { data: profile, loading, error, reload, setData } = useResource((signal) => getMyProfile({ signal }), []);
  const [modal, setModal] = useState(null); // details | skills | preferences | student | credential
  const [credential, setCredential] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [recording, setRecording] = useState(false);
  const [portfolioDraft, setPortfolioDraft] = useState(null);

  useEffect(() => {
    if (profile && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [profile, hash]);

  async function save(changes, message = 'Profile saved.') {
    try {
      const payload = await updateMyProfile(changes);
      setData(payload.data);
      toast.success(message);
      refresh();
      return true;
    } catch (requestError) {
      toast.error(Object.values(requestError.errors || {})[0]?.[0] || requestError.message);
      return false;
    }
  }

  async function upload(kind, file) {
    setUploading(kind);
    try {
      const payload = await uploadProfileMedia(kind, file);
      setData(payload.data);
      toast.success(kind === 'resume' ? 'Résumé uploaded.' : kind === 'video' ? 'Video uploaded.' : 'Photo updated.');
      refresh();
    } catch (requestError) {
      toast.error(requestError.field('file') || requestError.message);
    } finally {
      setUploading(null);
    }
  }

  async function removeMedia(kind) {
    try {
      const payload = await removeProfileMedia(kind);
      setData(payload.data);
      toast.success(kind === 'resume' ? 'Résumé removed.' : 'Video removed.');
    } catch (requestError) {
      toast.error(requestError);
    }
  }

  const [photoInput, pickPhoto] = useFilePicker('image/jpeg,image/png,image/webp', (file) => upload('image', file));
  const [videoInput, pickVideo] = useFilePicker('video/mp4,video/quicktime,video/webm', (file) => upload('video', file));
  const [resumeInput, pickResume] = useFilePicker('.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', (file) => upload('resume', file));

  if (loading && !profile) return <PageLoader label="Loading your profile…" />;
  if (error && !profile) return <main className="ec-main"><div className="ec-container"><ErrorState error={error} onRetry={reload} /></div></main>;

  const certifications = profile.credentials || [];
  const location = [profile.city, profile.province === 'British Columbia' ? 'BC' : profile.province].filter(Boolean).join(', ');
  const meta = [location, profile.years_experience ? `${profile.years_experience} years experience` : null, profile.languages.join(', ')].filter(Boolean).join(' · ');
  const publicUrl = `${window.location.origin}/educators/${profile.slug}`;
  const postalPrefix = profile.postal_code ? profile.postal_code.replace(/\s/g, '').slice(0, 3).toUpperCase() : null;
  const startLabel = profile.available_from ? toDate(profile.available_from).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' }) : 'Flexible';
  const chipGroups = [
    ['age_groups_preferred', 'Age groups'],
    ['areas_of_expertise', 'Areas of expertise'],
    ['special_interests', 'Special interests'],
    ['professional_development', 'Professional development'],
  ];

  return (
    <main className="ec-main" style={{ paddingTop: 32 }}>
      {photoInput}{videoInput}{resumeInput}
      <div className="ec-container" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <section className="ec-card ep-header">
          <div className="ep-cover" aria-hidden="true"><span /><span /><span /></div>
          <div className="ep-header-body">
            <button type="button" className="ep-photo" onClick={pickPhoto} aria-label="Change profile photo" disabled={uploading === 'image'}>
              {profile.photo_url ? <img src={profile.photo_url} alt="" /> : profile.initials}
              <span className="ep-photo-edit">{uploading === 'image' ? 'Uploading…' : 'Change photo'}</span>
            </button>
            <div className="ep-identity">
              <div>
                <h1>{profile.full_name}</h1>
                {profile.is_verified && <span className="ec-pill tone-green">✓ Verified educator</span>}
                <button type="button" className="ep-edit" onClick={() => setModal('details')}>Edit details</button>
              </div>
              <span className="ep-title">{profile.professional_title || 'Add your role or title'}</span>
              <span className="ep-meta">{meta || 'Add your location, experience and languages'}</span>
            </div>
            <div className="ep-header-actions">
              <button type="button" role="switch" aria-checked={profile.open_to_work ? 'true' : 'false'} className="ep-open"
                onClick={() => save({ open_to_work: !profile.open_to_work }, profile.open_to_work ? 'You’re hidden from new searches.' : 'You’re open to work.')}>
                <span className="ep-mini-track" />{profile.open_to_work ? 'Open to work' : 'Not looking'}
              </button>
              <Button variant="outline" to={`/educators/${profile.slug}`} style={{ fontSize: 14.5 }}>Preview public profile</Button>
            </div>
          </div>
        </section>

        <div className="ep-layout">
          <div className="ec-stack" style={{ gap: 18 }}>
            <section className="ep-section" id="video">
              <div className="ep-section-head"><h2>Introduction video</h2><span>Recommended 30–60 seconds</span></div>
              {profile.introduction_video_url ? (
                <div className="ep-video">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video src={profile.introduction_video_url} controls playsInline preload="metadata" />
                  <div className="ep-drop-actions">
                    <Button size="sm" variant="outline" onClick={pickVideo} loading={uploading === 'video'}>Replace</Button>
                    <Button size="sm" variant="danger" onClick={() => removeMedia('video')}>Remove</Button>
                  </div>
                </div>
              ) : (
                <div className="ep-dropzone">
                  <span className="ep-drop-icon"><Icon name="video" size={28} /></span>
                  <div className="ep-drop-copy"><strong>Let centres meet you before the interview</strong><span>Say hello, share why you love working with children and what a great day in your room looks like.</span></div>
                  <div className="ep-drop-actions">
                    <Button size="sm" onClick={pickVideo} loading={uploading === 'video'}>{uploading === 'video' ? 'Uploading…' : 'Upload video'}</Button>
                    <Button size="sm" variant="outline" onClick={() => setRecording(true)} style={{ color: '#42007B' }}>Record now</Button>
                  </div>
                </div>
              )}
            </section>

            <EditableText id="about" title="About me" value={profile.professional_summary} hint="Keep it to 3–5 sentences."
              placeholder="Your experience, strengths and what you love about working with children."
              emptyTitle="About me" emptyText="A short introduction is the first thing centres read."
              onSave={(value) => save({ professional_summary: value || null })} />

            <EditableText id="philosophy" title="Teaching philosophy" value={profile.teaching_philosophy} hint="A few sentences is plenty."
              placeholder="How you see children, play and learning."
              emptyTitle="Teaching philosophy" emptyText="How you see children, play and learning — centres read this closely."
              onSave={(value) => save({ teaching_philosophy: value || null })} />

            <section className="ep-section" id="certifications" style={{ gap: 6 }}>
              <div className="ep-section-head" style={{ marginBottom: 6 }}>
                <h2>Certifications &amp; education</h2>
                <button type="button" className="ep-edit" onClick={() => { setCredential(null); setModal('credential'); }}>+ Add</button>
              </div>
              {certifications.length === 0 && <p className="ec-muted" style={{ margin: '6px 0', fontSize: 14.5 }}>Add your ECE certificate, First Aid and education so centres can see you’re qualified.</p>}
              {certifications.map((item) => {
                const [bg, fg] = BADGE_TONES[item.badge] || BADGE_TONES.Pending;
                const detail = [item.issuer, item.expires_on ? `valid to ${toDate(item.expires_on).getFullYear()}` : item.issued_on ? (item.kind === 'education' ? `Graduated ${toDate(item.issued_on).getFullYear()}` : `Issued ${formatLongDate(item.issued_on)}`) : null].filter(Boolean).join(' · ');
                return (
                  <div className="ep-credential" key={item.id}>
                    <span className="ep-credential-icon" style={{ background: item.kind === 'education' ? '#F4F2F6' : item.badge === 'Verified' ? '#E8F3EA' : '#F4EFFA', color: item.kind === 'education' ? '#3A3346' : item.badge === 'Verified' ? '#016516' : '#42007B' }}>
                      <Icon name="shield" size={18} />
                    </span>
                    <span className="ep-credential-copy"><strong>{item.title}</strong>{detail && <span>{detail}</span>}</span>
                    <button type="button" className="ep-icon-btn" aria-label={`Edit ${item.title}`} onClick={() => { setCredential(item); setModal('credential'); }}><Icon name="edit" size={16} /></button>
                    <button type="button" className="ep-icon-btn" aria-label={`Remove ${item.title}`} onClick={async () => {
                      try { await deleteCredential(item.id); setData((current) => ({ ...current, credentials: current.credentials.filter((c) => c.id !== item.id) })); toast.success('Credential removed.'); reload({ silent: true }); } catch (e) { toast.error(e); }
                    }}><Icon name="trash" size={16} /></button>
                    <span className="ec-pill" style={{ background: bg, color: fg }}>{item.badge}</span>
                  </div>
                );
              })}
              <div className="ep-crc">
                <span>
                  <strong>Criminal record check <span style={{ fontWeight: 500, color: '#5C566A' }}>· optional</span></strong>
                  <small>
                    {profile.criminal_record_check_status === 'completed'
                      ? `Completed${profile.criminal_record_checked_on ? ` ${toDate(profile.criminal_record_checked_on).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })}` : ''}. Only the status is shown — never the document.`
                      : 'Mark it complete once you have a current check. Only the status is shown — never the document.'}
                  </small>
                </span>
                {profile.criminal_record_check_status === 'completed' ? (
                  <button type="button" role="switch" aria-checked={profile.show_criminal_record_status ? 'true' : 'false'} className="ep-crc-toggle"
                    onClick={() => save({ show_criminal_record_status: !profile.show_criminal_record_status })}>
                    <span className="ep-mini-track" />{profile.show_criminal_record_status ? 'Show status' : 'Hidden'}
                  </button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => save({ criminal_record_check_status: 'completed', criminal_record_checked_on: new Date().toISOString().slice(0, 10) }, 'Record check marked complete.')}>Mark complete</Button>
                )}
              </div>
            </section>

            <section className="ep-section" id="skills" style={{ gap: 16 }}>
              <div className="ep-section-head"><h2>Skills &amp; experience</h2><button type="button" className="ep-edit" onClick={() => setModal('skills')}>Edit</button></div>
              {chipGroups.map(([key, label]) => {
                const [bg, fg] = CHIP_TONES[key];
                return (
                  <div className="ep-chip-group" key={key}>
                    <span>{label}</span>
                    {profile[key].length
                      ? <span className="ep-chips">{profile[key].map((item) => <span key={item} style={{ background: bg, color: fg }}>{item}</span>)}</span>
                      : <span className="ep-empty-chips">Not added yet</span>}
                  </div>
                );
              })}
            </section>

            <section className="ep-section" id="preferences" style={{ gap: 16 }}>
              <div className="ep-section-head"><h2>Employment preferences</h2><span>Used for your job recommendations</span></div>
              <div className="ec-chips" role="group" aria-label="Employment preferences">
                {PREFERENCES.map(([key, label]) => {
                  const on = profile.employment_preferences.includes(key);
                  return (
                    <button key={key} type="button" role="checkbox" aria-checked={on ? 'true' : 'false'} className="ep-pref"
                      onClick={() => save({ employment_preferences: on ? profile.employment_preferences.filter((item) => item !== key) : [...profile.employment_preferences, key] }, 'Preferences saved.')}>
                      {label}
                    </button>
                  );
                })}
                <button type="button" role="checkbox" aria-checked={profile.open_to_relocation ? 'true' : 'false'} className="ep-pref" onClick={() => save({ open_to_relocation: !profile.open_to_relocation }, 'Preferences saved.')}>Open to relocation</button>
              </div>
              <div className="ec-facts ep-facts">
                <button type="button" className="ec-fact" onClick={() => setModal('preferences')} style={{ border: 0, textAlign: 'left', cursor: 'pointer' }}><span>Availability</span><span>{profile.availability.join(', ') || 'Add'}</span></button>
                <button type="button" className="ec-fact" onClick={() => setModal('preferences')} style={{ border: 0, textAlign: 'left', cursor: 'pointer' }}><span>Can start</span><span>{startLabel}</span></button>
                <button type="button" className="ec-fact" onClick={() => setModal('preferences')} style={{ border: 0, textAlign: 'left', cursor: 'pointer' }}><span>Search radius</span><span>{profile.search_radius_km} km{postalPrefix ? ` from ${postalPrefix}` : ''}</span></button>
              </div>
            </section>

            <section className="ep-section" id="student">
              <div className="ep-section-head">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <h2>ECE student information</h2>
                  <span className="ec-muted" style={{ fontSize: 14 }}>For practicum placements. Switch off after you graduate.</span>
                </div>
                <button type="button" role="switch" aria-checked={profile.student.enabled ? 'true' : 'false'} aria-label="Student mode" className="ec-switch"
                  onClick={() => save({ student: { enabled: !profile.student.enabled, looking_for_practicum: !profile.student.enabled ? profile.student.looking_for_practicum : false } }, profile.student.enabled ? 'Student details hidden.' : 'Student mode on.')} />
              </div>
              {profile.student.enabled && (
                <>
                  <div className="ec-facts ep-facts">
                    {[
                      ['School', profile.student.college_university],
                      ['Program', profile.student.program],
                      ['Practicum level', (options.practicum_levels || []).find((level) => level.key === profile.student.practicum_level)?.label],
                      ['Dates', profile.student.practicum_start_date ? `${formatLongDate(profile.student.practicum_start_date)}${profile.student.practicum_end_date ? ` – ${formatLongDate(profile.student.practicum_end_date)}` : ''}` : null],
                      ['Hours needed', profile.student.required_practicum_hours],
                      ['Graduating', profile.student.expected_graduation_date ? toDate(profile.student.expected_graduation_date).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' }) : null],
                    ].map(([label, value]) => <div className="ec-fact" key={label}><span>{label}</span><span>{value || '—'}</span></div>)}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setModal('student')} style={{ alignSelf: 'flex-start' }}>Edit student details</Button>
                </>
              )}
            </section>
          </div>

          <aside className="ep-side">
            <section className="ep-side-card">
              <div className="ep-strength-head"><strong>Profile strength</strong><span>{profile.completion.percent}%</span></div>
              <span className="ep-bar"><span style={{ width: `${profile.completion.percent}%` }} /></span>
              {profile.completion.items.map((item) => (
                <a key={item.key} href={`#${item.key === 'basic' ? 'top' : item.key}`} className={`ep-strength-item ${item.done ? '' : 'is-todo'}`} style={{ color: 'inherit' }}
                  onClick={(event) => { if (item.key === 'basic') { event.preventDefault(); setModal('details'); } }}>
                  <span className="ep-strength-dot">{item.done && <Icon name="check" size={11} strokeWidth={3.6} />}</span>{item.label}
                </a>
              ))}
            </section>

            <section className="ep-side-card" id="resume">
              <strong>Résumé &amp; portfolio</strong>
              {profile.resume ? (
                <div className="ep-file">
                  <span className="ep-file-badge" style={{ background: '#FDEBE4', color: '#8A3414' }}>{profile.resume.name.split('.').pop().toUpperCase().slice(0, 4)}</span>
                  <span className="ep-file-copy">
                    <button type="button" className="ec-link-btn" style={{ textAlign: 'left', fontWeight: 600, fontSize: 14 }} onClick={() => downloadMyResume(profile.resume.name).catch((e) => toast.error(e))}>{profile.resume.name}</button>
                    <small>{fileSize(profile.resume.size)} · shared with centres you apply to</small>
                  </span>
                  <button type="button" className="ep-icon-btn" aria-label="Replace résumé" onClick={pickResume}><Icon name="upload" size={16} /></button>
                  <button type="button" className="ep-icon-btn" aria-label="Remove résumé" onClick={() => removeMedia('resume')}><Icon name="trash" size={16} /></button>
                </div>
              ) : (
                <div className="ep-resume-drop">
                  <strong>Upload your résumé</strong><small>PDF or Word, up to 5 MB</small>
                  <Button size="sm" onClick={pickResume} loading={uploading === 'resume'} style={{ marginTop: 6 }}>{uploading === 'resume' ? 'Uploading…' : 'Choose file'}</Button>
                </div>
              )}
              {profile.portfolio.map((item, index) => (
                <div className="ep-file" key={`${item.url}-${index}`}>
                  <span className="ep-file-badge" style={{ background: '#E6EEF8', color: '#24466E' }}>LINK</span>
                  <span className="ep-file-copy"><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a><small>{item.note || new URL(item.url).hostname}</small></span>
                  <button type="button" className="ep-icon-btn" aria-label={`Remove ${item.title}`} onClick={() => save({ portfolio: profile.portfolio.filter((_, i) => i !== index) }, 'Link removed.')}>×</button>
                </div>
              ))}
              {portfolioDraft ? (
                <form className="ec-stack-sm" style={{ gap: 8 }} onSubmit={async (event) => {
                  event.preventDefault();
                  const ok = await save({ portfolio: [...profile.portfolio, { title: portfolioDraft.title, url: portfolioDraft.url, note: null }] }, 'Link added.');
                  if (ok) setPortfolioDraft(null);
                }}>
                  <Input placeholder="Title (e.g. Learning stories)" value={portfolioDraft.title} onChange={(event) => setPortfolioDraft({ ...portfolioDraft, title: event.target.value })} required maxLength={120} />
                  <Input type="url" placeholder="https://" value={portfolioDraft.url} onChange={(event) => setPortfolioDraft({ ...portfolioDraft, url: event.target.value })} required />
                  <span className="ec-row-flex" style={{ gap: 8 }}><Button size="sm" type="submit">Add link</Button><Button size="sm" variant="outline" onClick={() => setPortfolioDraft(null)}>Cancel</Button></span>
                </form>
              ) : (
                <button type="button" className="ec-link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }} onClick={() => setPortfolioDraft({ title: '', url: '' })}>+ Add a portfolio link</button>
              )}
            </section>

            <section className="ep-side-card">
              <strong>Who can see my profile</strong>
              <div role="radiogroup" aria-label="Profile visibility" className="ec-stack-sm" style={{ gap: 10 }}>
                {VISIBILITY.map(([key, label, description]) => (
                  <button key={key} type="button" role="radio" aria-checked={profile.visibility === key ? 'true' : 'false'} className="ep-radio" onClick={() => profile.visibility !== key && save({ visibility: key }, 'Visibility updated.')}>
                    <span className="ep-radio-ring" />
                    <span><strong>{label}</strong><small>{description}</small></span>
                  </button>
                ))}
              </div>
              <span className="ep-public-link">Public link: <Link to={`/educators/${profile.slug}`}>{publicUrl.replace(/^https?:\/\//, '')}</Link></span>
            </section>
          </aside>
        </div>
      </div>

      {modal === 'credential' && <CredentialModal credential={credential} onClose={() => setModal(null)} onSaved={() => { setModal(null); reload({ silent: true }); }} />}
      {modal === 'details' && <DetailsModal profile={profile} onClose={() => setModal(null)} onSave={async (changes) => { if (await save(changes)) setModal(null); }} />}
      {modal === 'skills' && <SkillsModal profile={profile} onClose={() => setModal(null)} onSave={async (changes) => { if (await save(changes)) setModal(null); }} />}
      {modal === 'preferences' && <PreferencesModal profile={profile} onClose={() => setModal(null)} onSave={async (changes) => { if (await save(changes)) setModal(null); }} />}
      {modal === 'student' && <StudentModal profile={profile} options={options} onClose={() => setModal(null)} onSave={async (changes) => { if (await save(changes)) setModal(null); }} />}
      <VideoRecorder open={recording} title="Record your introduction" onClose={() => setRecording(false)} onRecorded={(file) => upload('video', file)} />
    </main>
  );
}
