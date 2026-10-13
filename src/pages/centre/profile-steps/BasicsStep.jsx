import { Field, Input, Select } from '../../../components/ui/index.jsx';
import { useOptions } from '../../../hooks/useOptions.js';
import { REGIONS } from '../../../utils/validation.js';
import { RowEditor, StepTitle, useStepForm } from './shared.jsx';

const transform = (form) => ({
  ...form,
  social_links: form.social_links_text.split(/[,\n]/).map((link) => link.trim()).filter(Boolean),
  social_links_text: undefined,
  hours_of_operation: form.hours_of_operation.filter((row) => row.label.trim() && row.value.trim()),
  licence_type: form.licence_type || null,
});

const toForm = (centre) => ({
  name: centre.form.name || '',
  contact_person: centre.form.contact_person || '',
  phone: centre.form.phone || '',
  email: centre.form.email || '',
  website: centre.form.website || '',
  social_links_text: (centre.form.social_links || []).join(', '),
  address: centre.form.address || '',
  city: centre.form.city || '',
  postal_code: centre.form.postal_code || '',
  province: centre.form.province || 'British Columbia',
  country: centre.form.country || 'Canada',
  hours_of_operation: centre.form.hours_of_operation?.length ? centre.form.hours_of_operation : [
    { label: 'Mon – Fri', value: '' }, { label: 'Sat – Sun', value: 'Closed' },
  ],
  licence_type: centre.form.licence_type || '',
  licence_number: centre.form.licence_number || '',
});

export default function BasicsStep({ centre, ...handlers }) {
  const options = useOptions();

  const { form, set, setForm, errors } = useStepForm('basics', toForm, centre, { ...handlers, transform });

  return (
    <>
      <StepTitle number={1} title="Basic information" description="The essentials families and our team need to find and verify your centre." />
      <section className="cb-card">
        <div className="cb-card-head"><h3>Centre &amp; contact</h3><span>Shown on your public profile</span></div>
        <Field label="Centre name" error={errors.name}><Input value={form.name} onChange={set('name')} maxLength={255} invalid={errors.name} /></Field>
        <div className="ec-grid-2">
          <Field label="Contact person" error={errors.contact_person}><Input value={form.contact_person} onChange={set('contact_person')} maxLength={150} /></Field>
          <Field label="Phone" error={errors.phone}><Input type="tel" value={form.phone} onChange={set('phone')} invalid={errors.phone} /></Field>
        </div>
        <div className="ec-grid-2">
          <Field label="Email" error={errors.email}><Input type="email" value={form.email} onChange={set('email')} invalid={errors.email} /></Field>
          <Field label="Website" error={errors.website}><Input value={form.website} onChange={set('website')} placeholder="yourcentre.ca" invalid={errors.website} /></Field>
        </div>
        <Field label="Social links" error={errors.social_links}><Input value={form.social_links_text} onChange={set('social_links_text')} placeholder="Instagram, Facebook…" /></Field>
      </section>

      <section className="cb-card">
        <div className="cb-card-head"><h3>Location</h3><span>Used for distance search</span></div>
        <Field label="Street address" error={errors.address}><Input value={form.address} onChange={set('address')} autoComplete="street-address" /></Field>
        <div className="ec-grid-2">
          <Field label="City" error={errors.city}><Input value={form.city} onChange={set('city')} invalid={errors.city} /></Field>
          <Field label="Postal code" error={errors.postal_code}><Input value={form.postal_code} onChange={set('postal_code')} invalid={errors.postal_code} /></Field>
        </div>
        <div className="ec-grid-2">
          <Field label="Province" error={errors.province}><Select value={form.province} onChange={set('province')} options={REGIONS[form.country] || REGIONS.Canada} /></Field>
          <Field label="Country"><Select value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value, province: REGIONS[event.target.value][0] }))} options={Object.keys(REGIONS)} /></Field>
        </div>
      </section>

      <section className="cb-card">
        <div className="cb-card-head"><h3>Hours &amp; licensing</h3><span>Licensing status shows only after verification</span></div>
        <div className="ec-label">Hours of operation
          <RowEditor label="Hours" rows={form.hours_of_operation} onChange={(rows) => setForm((current) => ({ ...current, hours_of_operation: rows }))}
            keys={['label', 'value']} placeholders={['Mon – Fri', '7:30 AM – 5:30 PM']} />
          {errors['hours_of_operation.0.value'] && <span className="ec-field-error">{errors['hours_of_operation.0.value']}</span>}
        </div>
        <div className="ec-grid-2">
          <Field label="Licence type"><Select value={form.licence_type} onChange={set('licence_type')} placeholder="Select" options={options.licence_types || []} /></Field>
          <Field label="Licence number" hint="private" error={errors.licence_number}><Input value={form.licence_number} onChange={set('licence_number')} placeholder="[Your licence #]" maxLength={60} /></Field>
        </div>
      </section>
    </>
  );
}
