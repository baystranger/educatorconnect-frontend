import { useEffect, useState } from 'react';
import { Button, Checkmark } from '../../../components/ui/index.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { submitCentreProfile } from '../../../services/centreApi.js';
import { StepTitle } from './shared.jsx';

export const STEP_DEFS = [
  ['basics', 'Basics', 'Name, contact, hours, licence'],
  ['about', 'About your centre', 'Story, philosophy, routine'],
  ['programs', 'Programs & availability', 'Ages, programs, tuition'],
  ['media', 'Photos & video', 'Welcome video, gallery'],
  ['team', 'Team', 'Leadership & educators'],
  ['parents', 'For parents', 'Tours, waitlist, FAQs'],
  ['review', 'Review & publish', 'Check and submit'],
];

export default function ReviewStep({ centre, onSaved, onEdit, registerSave, setDirty, user }) {
  const toast = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const steps = centre.completion.steps;
  const live = centre.is_published && centre.status === 'published';

  useEffect(() => { setDirty(false); return registerSave(async () => true); }, [registerSave, setDirty]);

  async function submit() {
    setSubmitting(true);
    try {
      const response = await submitCentreProfile();
      onSaved(response.data);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.field('basics') || error.field('email') || error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <StepTitle number={7} title="Review & publish" description={live ? 'Your profile is live. Changes you save go live straight away.' : 'Changes are reviewed by our team before they go live.'} />
      <section className="cb-card" style={{ padding: 0, gap: 0, overflow: 'hidden' }}>
        {STEP_DEFS.slice(0, 6).map(([key, label]) => {
          const step = steps[key];
          const required = key === 'basics';
          return (
            <div className="cb-review-row" key={key}>
              <span className="cb-review-icon" style={{ background: step.complete ? '#E8F3EA' : required ? '#FDEBE4' : '#FFF6D6', color: step.complete ? '#016516' : required ? '#B42318' : '#7A5A00' }}>{step.complete ? '✓' : '!'}</span>
              <span className="cb-review-copy">
                <strong>{label}</strong>
                <span className={step.complete ? '' : 'is-warn'}>{step.summary}{!step.complete && step.recommendation ? ` — ${step.recommendation}` : ''}</span>
              </span>
              <span className={`ec-pill ${step.complete ? 'tone-green' : required ? 'tone-danger' : 'tone-yellow'}`}>{step.complete ? 'Complete' : required ? 'Required' : 'Recommended'}</span>
              <Button size="xs" variant="outline" onClick={() => onEdit(key)}>Edit</Button>
            </div>
          );
        })}
      </section>

      <section className="cb-card">
        <h3 style={{ margin: 0, fontSize: 17 }}>{live ? 'Your profile is live' : 'Before you publish'}</h3>
        {centre.status === 'pending_review' && <div className="ec-alert ec-alert-info">Submitted for review. We’ll email you when it’s live.</div>}
        <button type="button" role="checkbox" aria-checked={confirmed ? 'true' : 'false'} className="cb-consent" onClick={() => setConfirmed(!confirmed)}>
          <Checkmark checked={confirmed} />
          <span>I confirm the information is accurate and I have consent for any photos or videos that show children or staff.</span>
        </button>
        {!user?.email_verified && <div className="ec-alert ec-alert-warning">Verify your email address before publishing.</div>}
        <div className="ec-actions" style={{ justifyContent: 'flex-end' }}>
          <Button variant="outline" to={`/childcare/${centre.slug}`} disabled={!live}>{live ? 'Preview as a parent' : 'Preview available after publishing'}</Button>
          <Button onClick={submit} loading={submitting} disabled={!confirmed || !steps.basics.complete || !user?.email_verified}>{live ? 'Confirm & update' : 'Submit for review'}</Button>
        </div>
      </section>
    </>
  );
}
