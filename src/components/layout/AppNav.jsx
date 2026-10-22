import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROLE_CONFIG } from '../../constants/roles.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { announceNotifications } from '../../hooks/useLiveRefresh.js';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/accountApi.js';
import { timeAgo } from '../../utils/format.js';
import { Icon } from '../ui/index.jsx';

export const NOTE_TONES = { purple: 'purple', green: 'green', yellow: 'gold', gold: 'gold', danger: 'red' };
const POLL_INTERVAL_MS = 10000;

/** A nav item is active on its own path and any sub-path (e.g. /centre/jobs/new). */
function isActive(item, pathname) {
  const base = item.to.replace(/\/basics$/, '');
  return pathname === item.to || pathname === base || pathname.startsWith(`${base}/`);
}

function useOutsideClose(open, close) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => { if (ref.current && !ref.current.contains(event.target)) close(); };
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);
  return ref;
}

/** Signed-in top navigation (design component "AppNav", role: educator / centre). */
export default function AppNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const config = ROLE_CONFIG[user?.role] || ROLE_CONFIG.educator;
  const [panel, setPanel] = useState(null); // 'bell' | 'me' | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notes, setNotes] = useState({ items: [], unread: 0, loaded: false });
  const close = useCallback(() => setPanel(null), []);
  const toolsRef = useOutsideClose(panel !== null, close);
  const toast = useToast();
  const seenRef = useRef(null); // ids already shown; null until the first load
  const openNoteRef = useRef(null);

  const loadNotes = useCallback(async () => {
    try {
      const payload = await getNotifications();
      const items = payload.data || [];
      if (seenRef.current) {
        const fresh = items.filter((note) => !note.read && !seenRef.current.has(note.id));
        if (fresh.length) {
          fresh.slice(0, 3).reverse().forEach((note) => toast.activity(note.title, () => openNoteRef.current?.(note)));
          announceNotifications(fresh);
        }
      } else {
        seenRef.current = new Set();
      }
      items.forEach((note) => seenRef.current.add(note.id));
      setNotes({ items, unread: payload.meta?.unread_count ?? 0, loaded: true });
    } catch {
      setNotes((current) => ({ ...current, loaded: true }));
    }
  }, [toast]);

  // Near real-time: poll while the tab is visible and catch up as soon as it is shown again.
  useEffect(() => {
    loadNotes();
    const timer = setInterval(() => { if (!document.hidden) loadNotes(); }, POLL_INTERVAL_MS);
    const onVisible = () => { if (!document.hidden) loadNotes(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [loadNotes]);

  useEffect(() => {
    setPanel(null);
    setMobileOpen(false);
  }, [location.pathname]);

  async function openNote(note) {
    setPanel(null);
    if (!note.read) {
      setNotes((current) => ({
        ...current,
        unread: Math.max(0, current.unread - 1),
        items: current.items.map((item) => (item.id === note.id ? { ...item, read: true } : item)),
      }));
      markNotificationRead(note.id).catch(() => {});
    }
    if (note.href) navigate(note.href);
  }
  openNoteRef.current = openNote;

  async function markAll() {
    setNotes((current) => ({ ...current, unread: 0, items: current.items.map((item) => ({ ...item, read: true })) }));
    markAllNotificationsRead().catch(() => {});
  }

  async function handleSignOut() {
    await signOut();
    navigate('/signin', { replace: true });
  }

  const centreSlug = user?.childcare_centres?.[0]?.slug;
  const menu = config.menu.map((item) => (item.to === 'public-profile'
    ? { ...item, to: centreSlug ? `/childcare/${centreSlug}` : '/centre/profile/review' }
    : item));
  const photo = user?.educator_profile?.photo_url || user?.childcare_centres?.[0]?.logo_url;

  return (
    <header className="ec-nav">
      <div className="ec-nav-inner">
        <Link className="ec-nav-logo" to="/" aria-label="Educator Connect home">
          <img src="/educator-connect-logo.png" alt="Educator Connect" />
        </Link>

        <nav aria-label="Account" className={`ec-nav-links ${mobileOpen ? 'is-open' : ''}`} id="ec-nav-links">
          {config.nav.map((item) => (
            <Link key={item.id} to={item.to} aria-current={isActive(item, location.pathname) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ec-nav-tools" ref={toolsRef}>
          <button
            type="button"
            className="ec-bell"
            aria-label={`Notifications${notes.unread ? `, ${notes.unread} unread` : ''}`}
            aria-expanded={panel === 'bell' ? 'true' : 'false'}
            onClick={() => { setPanel(panel === 'bell' ? null : 'bell'); if (panel !== 'bell') loadNotes(); }}
          >
            <Icon name="bell" size={20} />
            {notes.unread > 0 && <span className="ec-bell-dot" />}
          </button>

          <button
            type="button"
            className="ec-me"
            aria-label="Account menu"
            aria-expanded={panel === 'me' ? 'true' : 'false'}
            onClick={() => setPanel(panel === 'me' ? null : 'me')}
          >
            <span className={`ec-me-avatar tone-${config.avatarTone}`}>
              {photo ? <img src={photo} alt="" /> : user?.initials}
            </span>
            <span className="ec-me-name">{user?.short_name}</span>
            <Icon name="chevronDown" size={14} strokeWidth={2.4} style={{ color: '#5C566A' }} />
          </button>

          <button
            type="button"
            className="ec-bell ec-nav-burger"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen ? 'true' : 'false'}
            aria-controls="ec-nav-links"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={20} />
          </button>

          {panel === 'bell' && (
            <div className="ec-popover ec-notes" role="dialog" aria-label="Notifications">
              <div className="ec-notes-head">
                <span>Notifications</span>
                <span className="ec-row-flex" style={{ gap: 14 }}>
                  {notes.unread > 0 && <button type="button" className="ec-link-btn" onClick={markAll}>Mark all read</button>}
                  <Link to="/settings?section=notifications">Settings</Link>
                </span>
              </div>
              {!notes.loaded && <div className="ec-state">Loading…</div>}
              {notes.loaded && notes.items.length === 0 && <div className="ec-state">You’re all caught up.</div>}
              {notes.items.map((note) => (
                <button key={note.id} type="button" className={`ec-note ${note.read ? '' : 'is-unread'}`} onClick={() => openNote(note)}>
                  <span className={`ec-note-icon tone-${NOTE_TONES[note.tone] || 'purple'}`}>{note.initials || '•'}</span>
                  <span className="ec-note-text">{note.title}<small>{timeAgo(note.created_at)}</small></span>
                  <span className="ec-note-dot" />
                </button>
              ))}
              <Link className="ec-notes-all" to={config.notificationsHref}>View all activity</Link>
            </div>
          )}

          {panel === 'me' && (
            <div className="ec-popover ec-menu" role="menu" aria-label="Account">
              <div className="ec-menu-head">
                <strong>{user?.display_name}</strong>
                <span>{config.label}</span>
              </div>
              {menu.map((item) => <Link key={item.label} role="menuitem" to={item.to}>{item.label}</Link>)}
              <button type="button" role="menuitem" className="is-danger" onClick={handleSignOut}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
