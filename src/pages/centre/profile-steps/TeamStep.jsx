import { useRef, useState } from 'react';
import { Avatar, Button, Field, Input, Textarea } from '../../../components/ui/index.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { uploadTeamPhoto } from '../../../services/centreApi.js';
import { initialsOf } from '../../../utils/format.js';
import { StepTitle, useStepForm } from './shared.jsx';

const blank = () => ({ name: '', title: '', years_experience: '', credentials: '', bio: '' });
const transform = (form) => ({
  team: form.team.filter((member) => member.name.trim()).map(({ photo_url: _photo, ...member }) => ({
    ...member,
    years_experience: member.years_experience === '' || member.years_experience === null ? null : Number(member.years_experience),
  })),
});

const toForm = (centre) => ({ team: centre.form.team.length ? centre.form.team.map((member) => ({ ...blank(), ...Object.fromEntries(Object.entries(member).map(([k, v]) => [k, v ?? ''])) })) : [blank()] });

export default function TeamStep({ centre, onSaved, ...handlers }) {
  const toast = useToast();
  const { form, setForm, errors, save, dirty } = useStepForm('team', toForm, centre, { onSaved, ...handlers, transform });
  const [uploading, setUploading] = useState(null);
  const fileInput = useRef(null);
  const target = useRef(null);
  const update = (index, key, value) => setForm((current) => ({ team: current.team.map((member, i) => (i === index ? { ...member, [key]: value } : member)) }));

  async function pickPhoto(index) {
    const member = form.team[index];
    if (!member.id || dirty) {
      // A new member must exist before it can have a photo.
      const saved = await save();
      if (!saved) return;
      toast.success('Team saved — now choose a photo for this person.');
      return;
    }
    target.current = member.id;
    fileInput.current?.click();
  }

  async function upload(file) {
    setUploading(target.current);
    try {
      const response = await uploadTeamPhoto(target.current, file);
      onSaved(response.data);
      toast.success(response.message);
    } catch (error) {
      toast.error(Object.values(error.errors || {})[0]?.[0] || error.message);
    } finally {
      setUploading(null);
    }
  }

  return (
    <>
      <StepTitle number={5} title="Team" description="Introduce your director and educators. Families trust centres that show the people their children will spend the day with." />
      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) upload(file); }} />
      {form.team.map((member, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <section className="cb-card" key={member.id || `new-${index}`}>
          <div className="cb-member">
            <button type="button" className="cb-member-photo" onClick={() => pickPhoto(index)} aria-label={`Upload a photo of ${member.name || 'this team member'}`} disabled={uploading === member.id}>
              {member.photo_url ? <img src={member.photo_url} alt="" /> : <Avatar initials={initialsOf(member.name) || '+'} name={member.name || String(index)} size={64} round />}
              <small>{uploading === member.id ? '…' : 'Photo'}</small>
            </button>
            <div className="ec-stack-sm">
              <div className="ec-grid-2">
                <Field label="Name" error={errors[`team.${index}.name`]}><Input value={member.name} onChange={(event) => update(index, 'name', event.target.value)} maxLength={120} /></Field>
                <Field label="Role"><Input value={member.title} onChange={(event) => update(index, 'title', event.target.value)} placeholder="Director, Toddler room lead…" maxLength={120} /></Field>
              </div>
              <div className="ec-grid-2">
                <Field label="Years of experience"><Input type="number" min={0} max={60} value={member.years_experience} onChange={(event) => update(index, 'years_experience', event.target.value)} /></Field>
                <Field label="Credentials"><Input value={member.credentials} onChange={(event) => update(index, 'credentials', event.target.value)} placeholder="ECE, IT, SN" maxLength={120} /></Field>
              </div>
              <Field label="Short bio" hint="optional"><Textarea rows={2} value={member.bio} onChange={(event) => update(index, 'bio', event.target.value)} maxLength={600} /></Field>
              <button type="button" className="ec-link-btn" style={{ alignSelf: 'flex-start', color: '#B42318', fontSize: 14 }} onClick={() => setForm((current) => ({ team: current.team.filter((_, i) => i !== index) }))}>Remove team member</button>
            </div>
          </div>
        </section>
      ))}
      <Button variant="secondary" onClick={() => setForm((current) => ({ team: [...current.team, blank()] }))} style={{ alignSelf: 'flex-start' }}>+ Add a team member</Button>
    </>
  );
}
