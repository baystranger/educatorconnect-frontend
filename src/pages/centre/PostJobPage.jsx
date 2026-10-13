import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, Button, ChoiceChips, ErrorState, Field, Icon, Input, PageLoader, Select, Switch, Textarea } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useOptions } from '../../hooks/useOptions.js';
import { createJob, getCentreJob, updateJob } from '../../services/centreApi.js';
import { formatLongDate, timeAgo } from '../../utils/format.js';
import { REGIONS } from '../../utils/validation.js';
import './centre.css';

const EMPTY = {
  title: '', category: 'early_childhood_educator', employment_type: 'full_time', number_of_positions: 1,
  start_date: '', application_deadline: '', use_centre_address: true, address: '', city: '', province: 'British Columbia',
  postal_code: '', show_pay: true, salary_min: '', salary_max: '', salary_period: 'hour', description: '',
  responsibilities: '', benefits: '', required_education: 'ece_certificate', experience_level: 'one_year',
  required_certifications: [], application_instructions: '', practicum_level: 'level_2', practicum_hours: '', partner_institutions: '',
};

function payLabel(form) {
  const money = (value) => (value === '' || value === null || value === undefined ? null : `$${Number(value).toLocaleString('en-CA')}`);
  const min = money(form.salary_min);
  const max = money(form.salary_max);
  if (!min && !max) return form.employment_type === 'practicum' ? 'Unpaid placement' : 'Pay not listed';
  const suffix = form.salary_period === 'year' ? '/yr' : '/hr';
  return `${min && max && min !== max ? `${min}–${max}` : min || max}${suffix}`;
}

export default function PostJobPage() {
  const { jobId } = useParams();
  const isEdit = Boolean(jobId);
  useDocumentTitle(isEdit ? 'Edit job posting' : 'Post a job');
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const options = useOptions();
  const centre = user?.childcare_centres?.[0];
  const [form, setForm] = useState(EMPTY);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(null); // draft | publish
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (!isEdit) return undefined;
    let active = true;
    getCentreJob(jobId)
      .then((payload) => {
        if (!active) return;
        const values = payload.data.form;
        setJob(payload.data);
        setForm({
          ...EMPTY,
          ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value ?? EMPTY[key] ?? ''])),
          use_centre_address: values.postal_code === centre?.postal_code && values.city === centre?.city,
          salary_min: values.salary_min ? Number(values.salary_min) : '',
          salary_max: values.salary_max ? Number(values.salary_max) : '',
        });
        setSavedAt(payload.data.published_at || null);
      })
      .catch((error) => active && setLoadError(error))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [isEdit, jobId, centre?.postal_code, centre?.city]);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const setValue = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const isPracticum = form.employment_type === 'practicum';
  const centreAddress = [centre?.address, centre?.city, [centre?.province === 'British Columbia' ? 'BC' : centre?.province, centre?.postal_code].filter(Boolean).join(' '), centre?.country].filter(Boolean).join(', ');

  const checks = useMemo(() => [
    ['Job title', form.title.trim().length > 0],
    ['Employment type', Boolean(form.employment_type)],
    ['Location', form.use_centre_address ? Boolean(centre?.city && centre?.postal_code) : Boolean(form.city && form.postal_code)],
    ['Description & benefits', form.description.trim().length > 0],
    ['Deadline', Boolean(form.application_deadline)],
  ], [form, centre]);
  const ready = checks.every(([, done]) => done);

  async function submit(publish) {
    setSaving(publish ? 'publish' : 'draft');
    setErrors({});
    const payload = {
      ...form,
      publish,
      number_of_positions: Number(form.number_of_positions) || 1,
      salary_min: form.salary_min === '' ? null : form.salary_min,
      salary_max: form.salary_max === '' ? null : form.salary_max,
      start_date: form.start_date || null,
      application_deadline: form.application_deadline || null,
      practicum_hours: isPracticum && form.practicum_hours ? Number(form.practicum_hours) : null,
      practicum_level: isPracticum ? form.practicum_level : null,
      partner_institutions: isPracticum ? form.partner_institutions || null : null,
    };
    try {
      const response = isEdit && job ? await updateJob(job.id, payload) : await createJob(payload);
      setJob(response.data);
      setSavedAt(new Date().toISOString());
      toast.success(response.message);
      if (publish) navigate('/centre/jobs?tab=published');
      else if (!isEdit) navigate(`/centre/jobs/${response.data.id}/edit`, { replace: true });
    } catch (error) {
      const fields = Object.fromEntries(Object.entries(error.errors || {}).map(([key, value]) => [key, value[0]]));
      setErrors(fields);
      toast.error(fields.publish || Object.values(fields)[0] || error.message);
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <PageLoader label="Loading posting…" />;
  if (loadError) return <main className="ec-main"><div className="ec-container"><ErrorState error={loadError} /></div></main>;

  const isLive = job?.status === 'published';

  return (
    <main className="ec-main" style={{ paddingTop: 28 }}>
      <div className="ec-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Link to="/centre/jobs" style={{ fontSize: 14.5, fontWeight: 600, color: '#3A3346' }}>← Job postings</Link>
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">{isEdit ? 'Edit job posting' : 'Post a job'}</h1>
            <p className="ec-sub">{isEdit ? 'Changes to a live posting show immediately.' : 'Takes about 5 minutes. Save a draft anytime.'}</p>
          </div>
          <span className="ec-muted" style={{ fontSize: 13.5 }}>{savedAt ? `Saved ${timeAgo(savedAt).toLowerCase()}` : 'Not saved yet'}</span>
        </div>

        <div className="pj-layout">
          <div className="ec-stack" style={{ gap: 18 }}>
            <section className="pj-section">
              <div className="pj-step"><span>1</span><h2>The role</h2></div>
              <Field label="Job title" hint="e.g. Early Childhood Educator — Preschool room" error={errors.title}>
                <Input value={form.title} onChange={set('title')} maxLength={255} invalid={errors.title} />
              </Field>
              <div className="ec-grid-2">
                <Field label="Job category" error={errors.category}><Select value={form.category} onChange={set('category')} options={options.job_categories || []} /></Field>
                <Field label="Number of positions" error={errors.number_of_positions}><Input type="number" min={1} max={100} value={form.number_of_positions} onChange={set('number_of_positions')} /></Field>
              </div>
              <div className="ec-label">Employment type
                <ChoiceChips label="Employment type" value={form.employment_type} onChange={setValue('employment_type')} options={options.employment_types || []} />
              </div>
              <div className="ec-grid-2">
                <Field label="Start date" error={errors.start_date}><Input type="date" value={form.start_date} onChange={set('start_date')} /></Field>
                <Field label="Application deadline" error={errors.application_deadline}><Input type="date" value={form.application_deadline} min={new Date().toISOString().slice(0, 10)} onChange={set('application_deadline')} invalid={errors.application_deadline} /></Field>
              </div>
              {isPracticum && (
                <div className="pj-practicum">
                  <Field label="Practicum level"><Select value={form.practicum_level} onChange={set('practicum_level')} options={options.practicum_levels || []} /></Field>
                  <Field label="Required hours" error={errors.practicum_hours}><Input type="number" min={1} value={form.practicum_hours} onChange={set('practicum_hours')} placeholder="200" /></Field>
                  <Field label="Partner institutions"><Input value={form.partner_institutions} onChange={set('partner_institutions')} placeholder="Any accredited program" maxLength={255} /></Field>
                </div>
              )}
            </section>

            <section className="pj-section" style={{ gap: 16 }}>
              <div className="pj-step"><span>2</span><h2>Location</h2></div>
              <button type="button" role="checkbox" aria-checked={form.use_centre_address ? 'true' : 'false'} className="pj-address" onClick={() => setValue('use_centre_address')(!form.use_centre_address)}>
                <span className="ec-check" data-checked={form.use_centre_address ? 'true' : 'false'}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
                <span><strong>Use my centre’s address</strong><small>{centreAddress || 'Add your address in your centre profile'}</small></span>
              </button>
              {!form.use_centre_address && (
                <div className="ec-stack-sm">
                  <Field label="Street address"><Input value={form.address} onChange={set('address')} placeholder="Street address" /></Field>
                  <div className="ec-grid-3">
                    <Field label="City" error={errors.city}><Input value={form.city} onChange={set('city')} /></Field>
                    <Field label="Postal code" error={errors.postal_code}><Input value={form.postal_code} onChange={set('postal_code')} /></Field>
                    <Field label="Province"><Select value={form.province} onChange={set('province')} options={REGIONS.Canada} /></Field>
                  </div>
                </div>
              )}
            </section>

            <section className="pj-section" style={{ gap: 16 }}>
              <div className="pj-pay-head">
                <div className="pj-step"><span>3</span><h2>Pay <small>· optional</small></h2></div>
                <span className="pj-pay-toggle">Show pay on posting <Switch size="sm" checked={form.show_pay} onChange={setValue('show_pay')} label="Show pay on posting" /></span>
              </div>
              <div className="ec-grid-3">
                <Field label="From" error={errors.salary_min}><Input inputMode="decimal" value={form.salary_min} onChange={set('salary_min')} placeholder="$26" /></Field>
                <Field label="To" error={errors.salary_max}><Input inputMode="decimal" value={form.salary_max} onChange={set('salary_max')} placeholder="$30" invalid={errors.salary_max} /></Field>
                <Field label="Per"><Select value={form.salary_period} onChange={set('salary_period')} options={options.salary_periods || [{ key: 'hour', label: 'Hour' }, { key: 'year', label: 'Year' }]} /></Field>
              </div>
              <span className="ec-muted" style={{ fontSize: 13.5 }}>Postings that show pay get more applications.</span>
            </section>

            <section className="pj-section" style={{ gap: 16 }}>
              <div className="pj-step"><span>4</span><h2>Description</h2></div>
              <Field label="About the role" error={errors.description}><Textarea rows={4} value={form.description} onChange={set('description')} maxLength={10000} invalid={errors.description} /></Field>
              <Field label="Responsibilities" hint="One per line" error={errors.responsibilities}><Textarea rows={3} value={form.responsibilities} onChange={set('responsibilities')} placeholder="One per line" maxLength={5000} /></Field>
              <Field label="Benefits" hint="One per line" error={errors.benefits}><Textarea rows={3} value={form.benefits} onChange={set('benefits')} placeholder="One per line" maxLength={5000} /></Field>
            </section>

            <section className="pj-section" style={{ gap: 16 }}>
              <div className="pj-step"><span>5</span><h2>Requirements</h2></div>
              <div className="ec-grid-2">
                <Field label="Required education"><Select value={form.required_education} onChange={set('required_education')} options={options.education_requirements || []} /></Field>
                <Field label="Experience"><Select value={form.experience_level} onChange={set('experience_level')} options={options.experience_levels || []} /></Field>
              </div>
              <div className="ec-label">Certifications
                <ChoiceChips multiple tone="green" label="Certifications" value={form.required_certifications} onChange={setValue('required_certifications')} options={options.certifications || []} />
              </div>
            </section>

            <section className="pj-section" style={{ gap: 16 }}>
              <div className="pj-step"><span>6</span><h2>How to apply</h2></div>
              <div className="pj-info">Educators apply with their Educator Connect profile, résumé and intro video. You’ll review them under <strong>Applicants</strong>.</div>
              <Field label="Extra instructions" hint="optional"><Textarea rows={2} value={form.application_instructions} onChange={set('application_instructions')} placeholder="e.g. Please mention your availability for a working interview." maxLength={2000} /></Field>
            </section>
          </div>

          <aside className="pj-side">
            <section className="ec-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="ec-eyebrow">Preview · How educators see it</span>
              <div className="pj-preview">
                <div className="pj-preview-title">
                  <Avatar initials={user?.initials} name={centre?.name} size={42} radius={12} src={centre?.logo_url} />
                  <span><strong>{form.title || 'Your job title'}</strong><small>{[centre?.name, form.use_centre_address ? centre?.city : form.city].filter(Boolean).join(' · ')}</small></span>
                </div>
                <div className="ec-row-flex ec-wrap" style={{ gap: 6 }}>
                  <span className="ec-pill ec-pill-sm tone-purple">{(options.employment_types || []).find((t) => t.key === form.employment_type)?.label || 'Type'}</span>
                  {(form.show_pay || isPracticum) && <span className="ec-pill ec-pill-sm tone-gray" style={{ fontWeight: 600 }}>{payLabel(form)}</span>}
                  {centre?.is_verified && <span className="ec-pill ec-pill-sm tone-green">Verified centre</span>}
                </div>
                <span className="ec-muted" style={{ fontSize: 13 }}>{form.application_deadline ? `Apply by ${formatLongDate(form.application_deadline)}` : 'No deadline set'}</span>
              </div>
            </section>
            <section className="ec-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <strong style={{ fontSize: 15.5 }}>{isLive ? 'Posting is live' : 'Ready to publish?'}</strong>
              {checks.map(([label, done]) => (
                <div key={label} className={`pj-check ${done ? '' : 'is-todo'}`}><i>{done && <Icon name="check" size={10} strokeWidth={3.6} />}</i>{label}</div>
              ))}
              <div className="ec-stack-sm" style={{ gap: 8, marginTop: 8 }}>
                <Button block onClick={() => submit(true)} loading={saving === 'publish'} disabled={!ready || saving === 'draft'} style={{ height: 50 }}>
                  {isLive ? 'Save changes' : 'Publish job'}
                </Button>
                {!isLive && <Button block variant="outline" onClick={() => submit(false)} loading={saving === 'draft'} disabled={!form.title.trim() || saving === 'publish'}>Save as draft</Button>}
              </div>
              {!ready && <span className="ec-muted" style={{ fontSize: 13 }}>Complete the checklist to publish.</span>}
              {!user?.email_verified && <div className="ec-alert ec-alert-warning" style={{ fontSize: 13.5 }}>Verify your email before publishing. You can still save drafts.</div>}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
