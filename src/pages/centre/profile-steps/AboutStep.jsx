import { ChoiceChips, Field, Textarea } from '../../../components/ui/index.jsx';
import TagInput from '../../../components/ui/TagInput.jsx';
import { useOptions } from '../../../hooks/useOptions.js';
import { RowEditor, StepTitle, useStepForm } from './shared.jsx';

const transform = (form) => ({
  ...form,
  daily_schedule: form.daily_schedule.filter((row) => row.time.trim() && row.activity.trim()),
});

const toForm = (centre) => ({
  about: centre.form.about || '',
  philosophy: centre.form.philosophy || '',
  mission_values: centre.form.mission_values || '',
  teaching_approaches: centre.form.teaching_approaches || [],
  highlights: centre.form.highlights || [],
  daily_schedule: centre.form.daily_schedule?.length ? centre.form.daily_schedule : [{ time: '', activity: '' }],
});

export default function AboutStep({ centre, ...handlers }) {
  const options = useOptions();

  const { form, set, setForm, errors } = useStepForm('about', toForm, centre, { ...handlers, transform });

  return (
    <>
      <StepTitle number={2} title="About your centre" description="Help families understand what makes your centre special." />
      <section className="cb-card">
        <div className="cb-card-head"><h3>Your story</h3></div>
        <Field label="About us" error={errors.about}><Textarea rows={4} value={form.about} onChange={set('about')} maxLength={2000} placeholder="Who you are, how long you’ve been caring for children, what families love about you." /></Field>
        <Field label="Philosophy" error={errors.philosophy}><Textarea rows={2} value={form.philosophy} onChange={set('philosophy')} maxLength={1000} /></Field>
        <Field label="Mission & values" error={errors.mission_values}><Textarea rows={2} value={form.mission_values} onChange={set('mission_values')} placeholder="e.g. Warmth, curiosity, community" maxLength={1000} /></Field>
      </section>
      <section className="cb-card">
        <div className="cb-card-head"><h3>How children learn here</h3></div>
        <div className="ec-label">Teaching approach
          <ChoiceChips multiple label="Teaching approach" value={form.teaching_approaches} onChange={(value) => setForm((current) => ({ ...current, teaching_approaches: value }))} options={options.teaching_approaches || []} />
        </div>
        <div className="ec-label">Highlights <span className="ec-hint">Shown as tags in search, e.g. Hot lunch, Outdoor every day</span>
          <TagInput label="Highlights" value={form.highlights} max={6} onChange={(value) => setForm((current) => ({ ...current, highlights: value }))} suggestions={['Hot lunch', 'Outdoor every day', 'Small group', 'Bilingual']} />
        </div>
        <div className="ec-label">Daily routine
          <RowEditor label="Daily routine" rows={form.daily_schedule} onChange={(rows) => setForm((current) => ({ ...current, daily_schedule: rows }))} keys={['time', 'activity']} placeholders={['7:30 AM', 'Arrival & free play']} />
        </div>
      </section>
    </>
  );
}
