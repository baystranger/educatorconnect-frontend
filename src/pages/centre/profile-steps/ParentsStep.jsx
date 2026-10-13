import { useRef, useState } from 'react';
import { Button, Field, Input, Textarea } from '../../../components/ui/index.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import { deleteCentreResource, uploadCentreResource } from '../../../services/centreApi.js';
import { StepTitle, useStepForm } from './shared.jsx';

const transform = (form) => ({
  tuition_info: form.tuition_info || null,
  tour_info: form.tour_info || null,
  waitlist_info: form.waitlist_info || null,
  faqs: form.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
});

const toForm = (centre) => ({
  tuition_info: centre.form.tuition_info || '',
  tour_info: centre.form.tour_info || '',
  waitlist_info: centre.form.waitlist_info || '',
  faqs: centre.form.faqs.length ? centre.form.faqs.map((faq) => ({ ...faq })) : [{ question: '', answer: '' }],
});

export default function ParentsStep({ centre, onSaved, ...handlers }) {
  const toast = useToast();

  const { form, set, setForm, errors } = useStepForm('parents', toForm, centre, { onSaved, ...handlers, transform });
  const [doc, setDoc] = useState({ title: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);
  const updateFaq = (index, key, value) => setForm((current) => ({ ...current, faqs: current.faqs.map((faq, i) => (i === index ? { ...faq, [key]: value } : faq)) }));

  async function uploadDoc(file) {
    setUploading(true);
    try {
      const response = await uploadCentreResource(file, doc.title || file.name.replace(/\.pdf$/i, ''), doc.description || null);
      onSaved(response.data);
      setDoc({ title: '', description: '' });
      toast.success(response.message);
    } catch (error) {
      toast.error(Object.values(error.errors || {})[0]?.[0] || error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <StepTitle number={6} title="For parents" description="Answer the questions families ask before they visit." />
      <section className="cb-card">
        <div className="cb-card-head"><h3>Tuition, tours &amp; waitlist</h3></div>
        <Field label="Tuition" error={errors.tuition_info}><Textarea rows={2} value={form.tuition_info} onChange={set('tuition_info')} placeholder="$200–$650 / month depending on age and schedule…" maxLength={1000} /></Field>
        <Field label="Tours" error={errors.tour_info}><Textarea rows={2} value={form.tour_info} onChange={set('tour_info')} placeholder="Tue & Thu at 10 AM or 3:30 PM. About 30 minutes." maxLength={1000} /></Field>
        <Field label="Waitlist" error={errors.waitlist_info}><Textarea rows={2} value={form.waitlist_info} onChange={set('waitlist_info')} placeholder="Free to join. Siblings first, then by date joined." maxLength={1000} /></Field>
      </section>

      <section className="cb-card">
        <div className="cb-card-head"><h3>Parent handbook &amp; documents</h3><span>PDF · up to 10 MB</span></div>
        {centre.resources.map((resource) => (
          <div className="ep-file" key={resource.id}>
            <span className="ep-file-badge" style={{ background: '#FDEBE4', color: '#8A3414' }}>PDF</span>
            <span className="ep-file-copy"><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>{resource.description && <small>{resource.description}</small>}</span>
            <button type="button" className="ep-icon-btn" aria-label={`Remove ${resource.title}`} onClick={async () => {
              try { const response = await deleteCentreResource(resource.id); onSaved(response.data); toast.success(response.message); } catch (e) { toast.error(e); }
            }}>×</button>
          </div>
        ))}
        <input ref={fileInput} type="file" accept="application/pdf" hidden onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) uploadDoc(file); }} />
        <div className="ec-grid-2">
          <Field label="Title"><Input value={doc.title} onChange={(event) => setDoc({ ...doc, title: event.target.value })} placeholder="Parent handbook 2026" maxLength={150} /></Field>
          <Field label="Description" hint="optional"><Input value={doc.description} onChange={(event) => setDoc({ ...doc, description: event.target.value })} placeholder="Policies, sick days, what to pack" maxLength={200} /></Field>
        </div>
        <Button size="sm" variant="outline" style={{ alignSelf: 'flex-start', color: '#42007B' }} loading={uploading} onClick={() => fileInput.current?.click()}>Upload PDF</Button>
      </section>

      <section className="cb-card">
        <div className="cb-card-head"><h3>Frequently asked questions</h3></div>
        {form.faqs.map((faq, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="cb-item" key={faq.id || `new-${index}`}>
            <div className="cb-item-head">
              <strong>Question {index + 1}</strong>
              <button type="button" className="ec-link-btn" style={{ color: '#B42318', fontSize: 14 }} onClick={() => setForm((current) => ({ ...current, faqs: current.faqs.filter((_, i) => i !== index) }))}>Remove</button>
            </div>
            <Input value={faq.question} onChange={(event) => updateFaq(index, 'question', event.target.value)} placeholder="Are meals provided?" aria-label={`Question ${index + 1}`} maxLength={200} invalid={errors[`faqs.${index}.question`]} />
            <Textarea rows={2} value={faq.answer} onChange={(event) => updateFaq(index, 'answer', event.target.value)} placeholder="Answer" aria-label={`Answer ${index + 1}`} maxLength={1500} invalid={errors[`faqs.${index}.answer`]} />
          </div>
        ))}
        <Button size="sm" variant="secondary" style={{ alignSelf: 'flex-start' }} onClick={() => setForm((current) => ({ ...current, faqs: [...current.faqs, { question: '', answer: '' }] }))}>+ Add a question</Button>
      </section>
    </>
  );
}
