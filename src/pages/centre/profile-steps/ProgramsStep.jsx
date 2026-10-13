import { Button, ChoiceChips, Field, Input, Select, Textarea } from '../../../components/ui/index.jsx';
import { useOptions } from '../../../hooks/useOptions.js';
import { StepTitle, useStepForm } from './shared.jsx';

const blankProgram = () => ({ name: '', description: '', min_age_months: '', max_age_months: '', schedule: 'full_day', capacity: '', educator_count: '', availability: 'spaces', tuition_amount: '', tuition_frequency: 'month' });
const toNumber = (value) => (value === '' || value === null || value === undefined ? null : Number(value));

const transform = (form) => ({
  programs: form.programs.map((program) => ({
    ...program,
    min_age_months: toNumber(program.min_age_months),
    max_age_months: toNumber(program.max_age_months),
    capacity: toNumber(program.capacity),
    educator_count: toNumber(program.educator_count),
    tuition_amount: toNumber(program.tuition_amount),
    description: program.description || null,
  })),
});

const toForm = (centre) => ({
  programs: centre.form.programs.length
    ? centre.form.programs.map((program) => ({ ...blankProgram(), ...Object.fromEntries(Object.entries(program).map(([key, value]) => [key, value ?? ''])) }))
    : [{ ...blankProgram(), name: 'Toddler', min_age_months: 18, max_age_months: 36 }],
});

export default function ProgramsStep({ centre, ...handlers }) {
  const options = useOptions();

  const { form, setForm, errors } = useStepForm('programs', toForm, centre, { ...handlers, transform });
  const update = (index, key, value) => setForm((current) => ({ programs: current.programs.map((program, i) => (i === index ? { ...program, [key]: value } : program)) }));
  const error = (index, key) => errors[`programs.${index}.${key}`];

  return (
    <>
      <StepTitle number={3} title="Programs & availability" description="List each room or program with its ages, schedule and current availability." />
      {form.programs.map((program, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <section className="cb-card" key={program.id || `new-${index}`}>
          <div className="cb-card-head">
            <h3>{program.name || `Program ${index + 1}`}</h3>
            <button type="button" className="ec-link-btn" style={{ color: '#B42318', fontSize: 14 }} onClick={() => setForm((current) => ({ programs: current.programs.filter((_, i) => i !== index) }))}>Remove</button>
          </div>
          <div className="ec-grid-2">
            <Field label="Program name" error={error(index, 'name')}><Input value={program.name} onChange={(event) => update(index, 'name', event.target.value)} placeholder="Infant, Toddler, Preschool…" maxLength={80} /></Field>
            <Field label="Schedule"><Select value={program.schedule} onChange={(event) => update(index, 'schedule', event.target.value)} options={options.program_schedules || []} /></Field>
          </div>
          <div className="ec-grid-2">
            <Field label="Youngest age (months)" error={error(index, 'min_age_months')}><Input type="number" min={0} max={156} value={program.min_age_months} onChange={(event) => update(index, 'min_age_months', event.target.value)} /></Field>
            <Field label="Oldest age (months)" error={error(index, 'max_age_months')}><Input type="number" min={1} max={156} value={program.max_age_months} onChange={(event) => update(index, 'max_age_months', event.target.value)} /></Field>
          </div>
          <div className="ec-grid-3">
            <Field label="Children"><Input type="number" min={1} value={program.capacity} onChange={(event) => update(index, 'capacity', event.target.value)} /></Field>
            <Field label="Educators"><Input type="number" min={0} value={program.educator_count} onChange={(event) => update(index, 'educator_count', event.target.value)} /></Field>
            <Field label="Tuition / month" hint="optional" error={error(index, 'tuition_amount')}><Input type="number" min={0} value={program.tuition_amount} onChange={(event) => update(index, 'tuition_amount', event.target.value)} placeholder="$" /></Field>
          </div>
          <div className="ec-label">Availability
            <ChoiceChips label="Availability" value={program.availability} onChange={(value) => update(index, 'availability', value)} options={options.program_availability || []} />
          </div>
          <Field label="Description" hint="optional"><Textarea rows={2} value={program.description} onChange={(event) => update(index, 'description', event.target.value)} maxLength={500} /></Field>
        </section>
      ))}
      <Button variant="secondary" onClick={() => setForm((current) => ({ programs: [...current.programs, blankProgram()] }))} style={{ alignSelf: 'flex-start' }}>+ Add a program</Button>
    </>
  );
}
