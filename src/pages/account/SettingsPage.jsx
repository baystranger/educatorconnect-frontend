import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Checkmark, ErrorState, Field, Input, Modal, PageLoader, Select, Switch } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useOptions } from '../../hooks/useOptions.js';
import { useResource } from '../../hooks/useResource.js';
import {
  changeEmail, changePassword, deactivateAccount, downloadMyData, getNotificationPreferences,
  updateAccount, updateNotificationPreferences,
} from '../../services/accountApi.js';
import { disconnectProvider, getSocialLoginUrl, requestPasswordReset, resendVerificationEmail } from '../../services/authApi.js';
import { getMyProfile, updateMyProfile } from '../../services/educatorApi.js';
import { REGIONS, passwordStrength } from '../../utils/validation.js';
import './settings.css';

const SECTIONS = [
  ['account', 'Account details'],
  ['security', 'Password & sign-in'],
  ['notifications', 'Notifications'],
  ['privacy', 'Privacy'],
  ['deactivate', 'Deactivate account'],
];

const fieldErrors = (error) => Object.fromEntries(Object.entries(error?.errors || {}).map(([key, value]) => [key, value[0]]));

function AccountSection({ user }) {
  const toast = useToast();
  const { setUser } = useAuth();
  const isEducator = user.role === 'educator';
  const isCentre = user.role === 'childcare_centre';
  const profile = user.educator_profile;
  const centre = user.childcare_centres?.[0];
  const initial = {
    name: user.name || '',
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: user.phone || '',
    city: (profile || centre)?.city || '',
    postal_code: (profile || centre)?.postal_code || '',
    province: (profile || centre)?.province || 'British Columbia',
    country: (profile || centre)?.country || 'Canada',
  };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const set = (key) => (event) => { setSaved(false); setForm((current) => ({ ...current, [key]: event.target.value })); };
  const regions = REGIONS[form.country] || REGIONS.Canada;

  async function save() {
    setSaving(true);
    setErrors({});
    try {
      const payload = isEducator ? form : isCentre ? { phone: form.phone } : { name: form.name, phone: form.phone };
      const response = await updateAccount(payload);
      setUser(response.data);
      setSaved(true);
    } catch (error) {
      setErrors(fieldErrors(error));
      if (!error.errors || !Object.keys(error.errors).length) toast.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="st-card">
      <div className="st-head">
        <h2>Account details</h2>
        <span>{isEducator ? 'Your contact information. Centres see it only after you apply.' : isCentre ? 'Sign-in and contact details for this account. Centre details live in your centre profile.' : 'Your name and contact details for this account.'}</span>
      </div>
      <div className="ec-grid-2">
        {isEducator ? (
          <>
            <Field label="First name" error={errors.first_name}><Input value={form.first_name} onChange={set('first_name')} autoComplete="given-name" maxLength={100} /></Field>
            <Field label="Last name" error={errors.last_name}><Input value={form.last_name} onChange={set('last_name')} autoComplete="family-name" maxLength={100} /></Field>
          </>
        ) : isCentre ? (
          <>
            <Field label="Centre"><Input value={centre?.name || ''} disabled /></Field>
            <Field label="Account holder"><Input value={user.name} disabled /></Field>
          </>
        ) : (
          <Field label="Full name" error={errors.name}><Input value={form.name} onChange={set('name')} autoComplete="name" maxLength={255} /></Field>
        )}
        <div className="ec-label">
          <span>Email</span>
          <span className="st-email">
            <span>{user.email}</span>
            <span className={`ec-pill ec-pill-sm ${user.email_verified ? 'tone-green' : 'tone-yellow'}`}>{user.email_verified ? 'Verified' : 'Not verified'}</span>
            <Button size="xs" variant="soft" onClick={() => setEmailModal(true)}>Change</Button>
          </span>
          {!user.email_verified && (
            <button type="button" className="ec-link-btn" style={{ alignSelf: 'flex-start', fontSize: 13.5 }}
              onClick={() => resendVerificationEmail().then((r) => toast.success(r.message)).catch((e) => toast.error(e))}>Resend verification email</button>
          )}
        </div>
        <Field label="Phone" error={errors.phone}><Input type="tel" value={form.phone} onChange={set('phone')} placeholder="Optional" autoComplete="tel" /></Field>
        {isEducator && (
          <>
            <Field label="City" error={errors.city}><Input value={form.city} onChange={set('city')} autoComplete="address-level2" /></Field>
            <Field label="Postal code" error={errors.postal_code}><Input value={form.postal_code} onChange={set('postal_code')} autoComplete="postal-code" /></Field>
            <Field label={form.country === 'Canada' ? 'Province / territory' : 'State'}><Select value={form.province} onChange={set('province')} options={regions} /></Field>
            <Field label="Country"><Select value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value, province: REGIONS[event.target.value][0] }))} options={Object.keys(REGIONS)} /></Field>
          </>
        )}
      </div>
      <div className="st-footer">
        {saved && <span className="st-saved" role="status">✓ Changes saved</span>}
        <Button variant="outline" onClick={() => { setForm(initial); setErrors({}); setSaved(false); }}>Cancel</Button>
        <Button onClick={save} loading={saving}>Save changes</Button>
      </div>
      {emailModal && <ChangeEmailModal user={user} onClose={() => setEmailModal(false)} />}
    </section>
  );
}

function ChangeEmailModal({ user, onClose }) {
  const { setUser } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      const response = await changeEmail(email, password);
      setUser(response.data);
      toast.success(response.message);
      onClose();
    } catch (error) {
      setErrors(fieldErrors(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open title="Change your email" onClose={onClose}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={submit} loading={saving} disabled={!email}>Update email</Button></>}>
      <p className="ec-muted" style={{ margin: 0, fontSize: 14.5 }}>We’ll send a verification link to the new address.</p>
      <Field label="New email" error={errors.email}><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></Field>
      {user.has_password && <Field label="Current password" error={errors.current_password}><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></Field>}
    </Modal>
  );
}

function SecuritySection({ user }) {
  const toast = useToast();
  const { setUser } = useAuth();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const linked = Object.fromEntries((user.social_providers || []).map((item) => [item.provider, item]));
  const notice = params.get('connected')
    ? `${params.get('connected') === 'google' ? 'Google' : 'LinkedIn'} is now connected.`
    : params.get('oauth_error') === 'account_conflict' ? 'That account is already connected to a different Educator Connect account.'
      : params.get('oauth_error') === 'unavailable' ? 'Google and LinkedIn sign-in aren’t configured yet.'
        : params.get('oauth_error') ? 'Connecting was cancelled or expired. Please try again.' : '';

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!passwordStrength(form.password).valid) nextErrors.password = 'Use 10+ characters with a number and a symbol.';
    if (form.password !== form.password_confirmation) nextErrors.password_confirmation = 'The passwords don’t match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await changePassword(form);
      setForm({ current_password: '', password: '', password_confirmation: '' });
      toast.success('Password updated.');
      setUser({ ...user, has_password: true });
    } catch (error) {
      setErrors(fieldErrors(error));
      if (!error.errors || !Object.keys(error.errors).length) toast.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function disconnect(provider) {
    try {
      const response = await disconnectProvider(provider);
      setUser(response.data);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.field('provider') || error.message);
    }
  }

  const methods = [
    { key: 'email', icon: '@', tone: 'tone-purple', title: 'Email & password', detail: user.has_password ? user.email : 'No password set yet', primary: true },
    { key: 'google', icon: 'G', tone: 'tone-gold', title: 'Google', detail: linked.google ? `Connected${linked.google.email ? ` as ${linked.google.email}` : ''}` : 'Not connected' },
    { key: 'linkedin', icon: 'in', tone: 'tone-blue', title: 'LinkedIn', detail: linked.linkedin ? `Connected${linked.linkedin.email ? ` as ${linked.linkedin.email}` : ''}` : 'Not connected' },
  ];

  return (
    <>
      <form className="st-card" onSubmit={submit}>
        <div className="st-head">
          <h2>{user.has_password ? 'Change password' : 'Set a password'}</h2>
          <span>Use 10+ characters with a number and a symbol.</span>
        </div>
        <div className="ec-grid-3">
          {user.has_password && <Field label="Current password" error={errors.current_password}><Input type="password" autoComplete="current-password" value={form.current_password} onChange={(event) => setForm({ ...form, current_password: event.target.value })} required /></Field>}
          <Field label="New password" error={errors.password}><Input type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></Field>
          <Field label="Confirm new password" error={errors.password_confirmation}><Input type="password" autoComplete="new-password" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} required /></Field>
        </div>
        <div className="st-footer" style={{ justifyContent: 'space-between' }}>
          {user.has_password ? (
            <button type="button" className="ec-link-btn" style={{ fontWeight: 600 }} onClick={() => requestPasswordReset(user.email).then(() => toast.success(`We emailed a reset link to ${user.email}.`)).catch((e) => toast.error(e))}>
              Forgot your current password?
            </button>
          ) : <span />}
          <Button type="submit" loading={saving}>Update password</Button>
        </div>
      </form>
      <section className="st-card">
        <div className="st-head"><h2>Sign-in methods</h2></div>
        {notice && <div className={`ec-alert ${params.get('connected') ? 'ec-alert-success' : 'ec-alert-warning'}`}>{notice}</div>}
        <div>
          {methods.map((method) => (
            <div className="st-method" key={method.key}>
              <span className={`st-method-icon ${method.tone}`}>{method.icon}</span>
              <span className="st-method-copy"><strong>{method.title}</strong><span>{method.detail}</span></span>
              {method.primary ? (
                <span className="ec-pill tone-purple">Primary</span>
              ) : linked[method.key] ? (
                <Button size="sm" variant="danger" onClick={() => disconnect(method.key)}>Disconnect</Button>
              ) : (
                <Button size="sm" variant="outline" style={{ color: '#42007B' }} onClick={() => window.location.assign(getSocialLoginUrl(method.key, 'connect'))}>Connect</Button>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function NotificationsSection({ user }) {
  const toast = useToast();
  const options = useOptions();
  const { data, loading, error, reload, setData } = useResource((signal) => getNotificationPreferences({ signal }), []);

  async function update(changes) {
    const previous = data.preferences;
    const next = {
      ...previous,
      ...(changes.job_alert_frequency ? { job_alert_frequency: changes.job_alert_frequency } : {}),
      types: { ...previous.types, ...Object.fromEntries(Object.entries(changes.types || {}).map(([key, value]) => [key, { ...previous.types[key], ...value }])) },
    };
    setData((current) => ({ ...current, preferences: next }));
    try {
      await updateNotificationPreferences(changes);
    } catch (requestError) {
      setData((current) => ({ ...current, preferences: previous }));
      toast.error(requestError);
    }
  }

  if (loading) return <section className="st-card"><PageLoader label="Loading notification settings…" /></section>;
  if (error) return <section className="st-card"><ErrorState error={error} onRetry={reload} /></section>;

  return (
    <section className="st-card">
      <div className="st-head"><h2>Notifications</h2><span>Choose what we send you. Security emails like password resets always go out.</span></div>
      <div>
        <div className="st-notify-head"><span>WHAT</span><span>EMAIL</span><span>IN-APP</span></div>
        {data.definitions.map((definition) => {
          const value = data.preferences.types[definition.key];
          return (
            <div className="st-notify-row" key={definition.key}>
              <span><strong>{definition.label}</strong><small>{definition.description}</small></span>
              <span><Switch size="sm" checked={value.email} label={`${definition.label} by email`} onChange={(checked) => update({ types: { [definition.key]: { email: checked } } })} /></span>
              <span><Switch size="sm" checked={value.in_app} label={`${definition.label} in app`} onChange={(checked) => update({ types: { [definition.key]: { in_app: checked } } })} /></span>
            </div>
          );
        })}
      </div>
      {user.role === 'educator' && (
        <Field label="Job alert frequency" className="st-frequency">
          <Select value={data.preferences.job_alert_frequency} onChange={(event) => update({ job_alert_frequency: event.target.value })} options={options.job_alert_frequencies || []} style={{ maxWidth: 320 }} />
        </Field>
      )}
    </section>
  );
}

function PrivacySection({ user }) {
  const toast = useToast();
  const { refresh } = useAuth();
  const options = useOptions();
  const [downloading, setDownloading] = useState(false);
  const isEducator = user.role === 'educator';
  const { data: profile, setData } = useResource((signal) => getMyProfile({ signal }), [], { enabled: isEducator });

  async function save(changes) {
    try {
      const payload = await updateMyProfile(changes);
      setData(payload.data);
      toast.success('Privacy settings saved.');
      refresh();
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <section className="st-card">
      <div className="st-head"><h2>Privacy</h2></div>
      <div>
        {isEducator && profile && (
          <>
            <div className="st-pref-row">
              <span><strong>Profile visibility</strong><small>Who can find your profile in educator search.</small></span>
              <Select value={profile.visibility} onChange={(event) => save({ visibility: event.target.value })} options={options.profile_visibility || []} />
            </div>
            <div className="st-pref-row">
              <span><strong>Show criminal record check status</strong><small>Only “Completed” is shown, never the document.</small></span>
              <Switch checked={profile.show_criminal_record_status} label="Show criminal record check status" onChange={(checked) => save({ show_criminal_record_status: checked })} />
            </div>
          </>
        )}
        <div className="st-pref-row">
          <span><strong>Download my data</strong><small>A copy of your profile, applications and settings (JSON).</small></span>
          <Button variant="outline" loading={downloading} onClick={async () => {
            setDownloading(true);
            try { await downloadMyData(); } catch (error) { toast.error(error); } finally { setDownloading(false); }
          }}>Request download</Button>
        </div>
      </div>
    </section>
  );
}

function DeactivateSection({ user }) {
  const toast = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isEducator = user.role === 'educator';

  async function deactivate() {
    setBusy(true);
    setError('');
    try {
      await deactivateAccount(password);
      await signOut().catch(() => {});
      navigate('/signin?deactivated=1', { replace: true });
    } catch (requestError) {
      setError(requestError.field('password') || requestError.message);
      if (requestError.status >= 500) toast.error(requestError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="st-card st-danger">
      <div className="st-head"><h2>Deactivate account</h2></div>
      <p>
        {{
          educator: 'Your profile will be hidden from centres and your open applications will be withdrawn.',
          childcare_centre: 'Your centre profile will be hidden from families and your open job postings will be closed.',
          professional: 'Your directory listings will be hidden from centres.',
        }[user.role] || 'You will be signed out and lose access to this account.'}
        {' '}You can reactivate by signing in again within 30 days — after that your data is deleted.
      </p>
      {isEducator && <div className="st-tip">Just need a break? Turn off <strong>Open to work</strong> on your profile instead — you’ll stay signed up but won’t appear in searches.</div>}
      <button type="button" role="checkbox" aria-checked={confirm ? 'true' : 'false'} className="st-confirm" onClick={() => setConfirm(!confirm)}>
        <Checkmark checked={confirm} />
        {{ educator: 'I understand my applications will be withdrawn', childcare_centre: 'I understand my postings will be closed', professional: 'I understand my listings will be hidden' }[user.role] || 'I understand'}
      </button>
      {user.has_password && (
        <Field label="Confirm with your password" error={error}>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" style={{ maxWidth: 360 }} />
        </Field>
      )}
      {!user.has_password && error && <div className="ec-alert ec-alert-error">{error}</div>}
      <div>
        <Button variant="danger-solid" disabled={!confirm || (user.has_password && !password)} loading={busy} onClick={deactivate}>Deactivate my account</Button>
      </div>
    </section>
  );
}

export default function SettingsPage() {
  useDocumentTitle('Settings');
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const section = SECTIONS.some(([key]) => key === params.get('section')) ? params.get('section') : 'account';

  useEffect(() => { window.scrollTo(0, 0); }, [section]);

  return (
    <main className="ec-main">
      <div className="ec-container ec-stack">
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">Settings</h1>
            <p className="ec-sub">Manage your account, sign-in, notifications and privacy.</p>
          </div>
        </div>
        <div className="st-layout">
          <nav className="st-nav" aria-label="Settings sections">
            {SECTIONS.map(([key, label]) => (
              <button key={key} type="button" className={key === 'deactivate' ? 'is-danger' : ''} aria-current={section === key ? 'page' : undefined} onClick={() => setParams({ section: key }, { replace: true })}>
                {label}
              </button>
            ))}
          </nav>
          <div>
            {section === 'account' && <AccountSection user={user} key={user.id} />}
            {section === 'security' && <SecuritySection user={user} />}
            {section === 'notifications' && <NotificationsSection user={user} />}
            {section === 'privacy' && <PrivacySection user={user} />}
            {section === 'deactivate' && <DeactivateSection user={user} />}
          </div>
        </div>
      </div>
    </main>
  );
}
