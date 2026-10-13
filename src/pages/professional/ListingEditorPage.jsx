import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Avatar, Button, ErrorState, Field, Input, PageLoader, Select, Switch, Textarea } from '../../components/ui/index.jsx';
import TagInput from '../../components/ui/TagInput.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useResource } from '../../hooks/useResource.js';
import { createListing, getMyListings, updateListing, uploadListingLogo } from '../../services/professionalApi.js';
import { getProfessionalCategories } from '../../services/publicApi.js';
import { REGIONS } from '../../utils/validation.js';
import './professional.css';

const EMPTY = {
  professional_category_id: '', name: '', professional_title: '', description: '',
  services_offered: [], credentials: [], address: '', service_area: '',
  city: '', province: 'British Columbia', postal_code: '', country: 'Canada',
  website: '', email: '', phone: '', book_consultation: false,
};

const toForm = (listing) => Object.fromEntries(Object.keys(EMPTY).map((key) => [key, listing[key] ?? EMPTY[key]]));
const fieldErrors = (error) => Object.fromEntries(Object.entries(error?.errors || {}).map(([key, value]) => [key.split('.')[0], value[0]]));

/** Create or edit a professional directory listing. */
export default function ListingEditorPage() {
  const { listingId } = useParams();
  const isNew = !listingId;
  useDocumentTitle(isNew ? 'Add a listing' : 'Edit listing');
  const navigate = useNavigate();
  const toast = useToast();
  const logoInput = useRef(null);

  const { data: categories } = useResource((signal) => getProfessionalCategories({ signal }), []);
  const { data: mine, loading, error, reload } = useResource((signal) => getMyListings({ signal }), [], { enabled: !isNew });
  const listing = isNew ? null : mine?.listings?.find((item) => String(item.id) === listingId);

  const [form, setForm] = useState(EMPTY);
  const [logoUrl, setLogoUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (listing) {
      setForm(toForm(listing));
      setLogoUrl(listing.logo_url);
    }
  }, [listing]);

  if (!isNew && loading) return <PageLoader />;
  if (!isNew && error) return <main className="ec-main"><div className="ec-container"><ErrorState error={error} onRetry={reload} /></div></main>;
  if (!isNew && mine && !listing) {
    return <main className="ec-main"><div className="ec-container"><ErrorState title="Listing not found" error={{ message: 'This listing doesn’t exist or isn’t yours.' }} /></div></main>;
  }

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const setValue = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const regions = REGIONS[form.country] || REGIONS.Canada;

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = { ...form, professional_category_id: Number(form.professional_category_id) || null };
    // Optional fields go as null rather than '' so URL / email validation only runs when filled in.
    ['professional_title', 'description', 'address', 'service_area', 'website', 'email', 'phone'].forEach((key) => {
      if (!String(payload[key] || '').trim()) payload[key] = null;
    });
    try {
      const response = isNew ? await createListing(payload) : await updateListing(listing.id, payload);
      toast.success(response.message);
      navigate(isNew ? `/professional/listings/${response.data.id}/edit` : '/professional', { replace: isNew });
    } catch (requestError) {
      setErrors(fieldErrors(requestError));
      toast.error(requestError);
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadListingLogo(listing.id, file);
      setLogoUrl(response.data.logo_url);
      toast.success(response.message);
    } catch (requestError) {
      toast.error(requestError.field?.('file') || requestError);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="ec-main" style={{ paddingTop: 28 }}>
      <form className="ec-container ec-stack pr-editor" onSubmit={save} noValidate>
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">{isNew ? 'Add your listing' : `Edit ${listing?.name}`}</h1>
            <p className="ec-sub">This is what childcare centres see in the professional directory.</p>
          </div>
          <div className="ec-actions">
            <Button variant="outline" to="/professional">Cancel</Button>
            <Button type="submit" loading={saving}>{isNew ? 'Submit for review' : 'Save changes'}</Button>
          </div>
        </div>

        {listing?.status === 'rejected' && listing.review_notes && (
          <Alert tone="warning"><strong>Changes requested:</strong> {listing.review_notes} Saving sends your listing back for review.</Alert>
        )}
        {isNew && <Alert tone="info">New listings are checked by our team before they appear publicly — usually within two business days.</Alert>}

        {!isNew && (
          <section className="ec-card ec-card-pad pr-logo">
            <Avatar initials={listing?.initials} name={form.name} src={logoUrl} size={72} />
            <span className="ec-stack-sm" style={{ gap: 4 }}>
              <strong>Logo or photo</strong>
              <small className="ec-muted">JPG, PNG or WebP, at least 200 × 200 px.</small>
            </span>
            <input ref={logoInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={uploadLogo} />
            <Button variant="soft" size="sm" loading={uploading} onClick={() => logoInput.current?.click()}>{logoUrl ? 'Replace' : 'Upload'}</Button>
          </section>
        )}

        <section className="ec-card ec-card-pad ec-stack-sm" aria-labelledby="pr-about">
          <h2 className="ec-h2" id="pr-about">About your practice</h2>
          <div className="ec-grid-2">
            <Field label="Business or practice name" error={errors.name}>
              <Input value={form.name} onChange={set('name')} required maxLength={255} invalid={errors.name} />
            </Field>
            <Field label="Category" error={errors.professional_category_id}>
              <Select value={form.professional_category_id} onChange={set('professional_category_id')} placeholder="Choose a category" invalid={errors.professional_category_id}
                options={(categories || []).map((category) => ({ value: category.id, label: category.name }))} />
            </Field>
          </div>
          <Field label="Professional title" hint="(optional)" error={errors.professional_title}>
            <Input value={form.professional_title} onChange={set('professional_title')} placeholder="e.g. Registered Speech-Language Pathologist" maxLength={255} />
          </Field>
          <Field label="Description" hint="(optional)" error={errors.description}>
            <Textarea rows={5} value={form.description} onChange={set('description')} maxLength={5000} placeholder="Who you work with, how you support centres and families…" />
          </Field>
          <div className="ec-grid-2">
            <Field label="Services offered" error={errors.services_offered}>
              <TagInput value={form.services_offered} onChange={setValue('services_offered')} placeholder="e.g. In-centre screening" />
            </Field>
            <Field label="Credentials" error={errors.credentials}>
              <TagInput value={form.credentials} onChange={setValue('credentials')} placeholder="e.g. SAC-BC registered" />
            </Field>
          </div>
          <div className="ec-row-flex pr-switch-row">
            <Switch checked={form.book_consultation} onChange={setValue('book_consultation')} label="Offer free consultations" />
            <span><strong>Offer a free consultation</strong><small className="ec-muted">Shows a “Book consultation” badge on your listing.</small></span>
          </div>
        </section>

        <section className="ec-card ec-card-pad ec-stack-sm" aria-labelledby="pr-where">
          <h2 className="ec-h2" id="pr-where">Where you work</h2>
          <div className="ec-grid-2">
            <Field label="City" error={errors.city}><Input value={form.city} onChange={set('city')} required autoComplete="address-level2" invalid={errors.city} /></Field>
            <Field label="Postal code" error={errors.postal_code}><Input value={form.postal_code} onChange={set('postal_code')} required autoComplete="postal-code" invalid={errors.postal_code} /></Field>
            <Field label="Country">
              <Select value={form.country} options={Object.keys(REGIONS)}
                onChange={(event) => setForm((current) => ({ ...current, country: event.target.value, province: REGIONS[event.target.value][0] }))} />
            </Field>
            <Field label={form.country === 'Canada' ? 'Province / territory' : 'State'} error={errors.province}>
              <Select value={form.province} onChange={set('province')} options={regions} />
            </Field>
          </div>
          <div className="ec-grid-2">
            <Field label="Street address" hint="(optional)" error={errors.address}><Input value={form.address} onChange={set('address')} autoComplete="street-address" /></Field>
            <Field label="Service area" hint="(optional)" error={errors.service_area}><Input value={form.service_area} onChange={set('service_area')} placeholder="e.g. Metro Vancouver, virtual across BC" /></Field>
          </div>
        </section>

        <section className="ec-card ec-card-pad ec-stack-sm" aria-labelledby="pr-contact">
          <h2 className="ec-h2" id="pr-contact">How centres reach you</h2>
          <div className="ec-grid-3">
            <Field label="Website" error={errors.website}><Input type="url" value={form.website} onChange={set('website')} placeholder="https://" invalid={errors.website} /></Field>
            <Field label="Email" error={errors.email}><Input type="email" value={form.email} onChange={set('email')} invalid={errors.email} /></Field>
            <Field label="Phone" error={errors.phone}><Input type="tel" value={form.phone} onChange={set('phone')} /></Field>
          </div>
        </section>

        <div className="ec-actions" style={{ justifyContent: 'flex-end' }}>
          <Button variant="outline" to="/professional">Cancel</Button>
          <Button type="submit" loading={saving}>{isNew ? 'Submit for review' : 'Save changes'}</Button>
        </div>
      </form>
    </main>
  );
}
