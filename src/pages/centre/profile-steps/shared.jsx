import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import { updateCentreSection } from '../../../services/centreApi.js';

/**
 * Local form state for one builder step, with dirty tracking and a save() that the
 * page header ("Save draft") and the step's own buttons both use.
 */
export function useStepForm(section, toForm, centre, { onSaved, registerSave, setDirty, transform = (value) => value }) {
  const toast = useToast();
  const [initial] = useState(() => toForm(centre));
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const baseline = useRef(JSON.stringify(initial));

  const dirty = JSON.stringify(form) !== baseline.current;
  useEffect(() => { setDirty(dirty); }, [dirty, setDirty]);

  const save = useCallback(async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = await updateCentreSection(section, transform(form));
      // Re-read from the server so new rows pick up their ids.
      const fresh = toForm(payload.data);
      baseline.current = JSON.stringify(fresh);
      setForm(fresh);
      setDirty(false);
      onSaved(payload.data);
      return true;
    } catch (error) {
      const fields = Object.fromEntries(Object.entries(error.errors || {}).map(([key, value]) => [key, value[0]]));
      setErrors(fields);
      toast.error(Object.values(fields)[0] || error.message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [section, form, toForm, transform, onSaved, setDirty, toast]);

  useEffect(() => registerSave(save), [registerSave, save]);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event?.target ? event.target.value : event }));

  return { form, setForm, set, errors, saving, save, dirty };
}

/** Editable two-column rows (hours of operation, daily routine). */
export function RowEditor({ rows, onChange, keys, placeholders, addLabel = '+ Add', label }) {
  const [first, second] = keys;
  return (
    <div className="cb-rows" role="group" aria-label={label}>
      {rows.map((row, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className="cb-row" key={index}>
          <input value={row[first]} placeholder={placeholders[0]} aria-label={`${label} ${index + 1} ${first}`} maxLength={40}
            onChange={(event) => onChange(rows.map((item, i) => (i === index ? { ...item, [first]: event.target.value } : item)))} />
          <input value={row[second]} placeholder={placeholders[1]} aria-label={`${label} ${index + 1} ${second}`} maxLength={120}
            onChange={(event) => onChange(rows.map((item, i) => (i === index ? { ...item, [second]: event.target.value } : item)))} />
          <button type="button" className="ep-icon-btn" aria-label={`Remove row ${index + 1}`} onClick={() => onChange(rows.filter((_, i) => i !== index))}>×</button>
        </div>
      ))}
      <button type="button" className="cb-add" onClick={() => onChange([...rows, { [first]: '', [second]: '' }])}>{addLabel}</button>
    </div>
  );
}

export function StepTitle({ number, title, description }) {
  return (
    <div className="cb-title">
      <span className="ec-eyebrow">Step {number} of 7</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
