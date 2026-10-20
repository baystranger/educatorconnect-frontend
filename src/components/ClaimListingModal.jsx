import { useState } from 'react';
import { Alert, Button, Field, Input, Modal, Textarea } from './ui/index.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useUnsavedChanges } from '../context/UnsavedChangesContext.jsx';
import { claimListing } from '../services/professionalApi.js';

const fieldErrors = (error) => Object.fromEntries(Object.entries(error?.errors || {}).map(([key, value]) => [key, value[0]]));

/** A professional asks to take ownership of an unclaimed directory listing. */
export default function ClaimListingModal({ listing, onClose, onClaimed }) {
  const toast = useToast();
  const [form, setForm] = useState({ business_domain_email: '', business_phone: '', credential_information: '' });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const hasEvidence = Object.values(form).some((value) => value.trim()) || file;
  useUnsavedChanges(Boolean(hasEvidence), { message: 'Your claim hasn’t been submitted yet. Leaving will discard it.' });

  async function submit() {
    setBusy(true);
    setErrors({});
    setError('');
    try {
      const fields = Object.fromEntries(Object.entries(form).filter(([, value]) => value.trim()));
      const response = await claimListing(listing.id, { ...fields, supporting_document: file || undefined });
      toast.success(response.message);
      onClaimed?.();
      onClose();
    } catch (requestError) {
      setErrors(fieldErrors(requestError));
      if (!Object.keys(requestError.errors || {}).length) setError(requestError.message);
      toast.error(Object.values(fieldErrors(requestError))[0] || requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open title={`Claim ${listing.name}`} onClose={onClose}
      footer={(
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={busy} disabled={!hasEvidence} onClick={submit}>Submit claim</Button>
        </>
      )}>
      <div className="ec-stack-sm">
        <p className="ec-muted" style={{ margin: 0 }}>Tell us how we can confirm this is your business. An administrator reviews every claim before you can edit the listing.</p>
        {error && <Alert tone="error">{error}</Alert>}
        <Field label="Business email" hint="(on your business domain)" error={errors.business_domain_email}>
          <Input type="email" value={form.business_domain_email} onChange={set('business_domain_email')} placeholder="you@yourpractice.ca" />
        </Field>
        <Field label="Business phone" error={errors.business_phone}>
          <Input type="tel" value={form.business_phone} onChange={set('business_phone')} />
        </Field>
        <Field label="Credentials or registration numbers" error={errors.credential_information}>
          <Textarea rows={3} value={form.credential_information} onChange={set('credential_information')} maxLength={5000} />
        </Field>
        <Field label="Supporting document" hint="(PDF, JPG or PNG, up to 10 MB)" error={errors.supporting_document}>
          <Input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </Field>
      </div>
    </Modal>
  );
}
