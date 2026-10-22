import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NOTE_TONES } from '../../components/layout/AppNav.jsx';
import { Button, EmptyState, ErrorState, Skeleton, Tabs } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useLiveRefresh } from '../../hooks/useLiveRefresh.js';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/accountApi.js';
import { timeAgo } from '../../utils/format.js';

const PER_PAGE = 20;
const TABS = [{ key: 'all', label: 'All' }, { key: 'unread', label: 'Unread' }];

/** Every notification for the signed-in account, newest first, updated live. */
export default function ActivityPage() {
  useDocumentTitle('Activity');
  const navigate = useNavigate();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [state, setState] = useState({ items: [], page: 0, lastPage: 1, unread: 0, loading: true, error: null });

  const load = useCallback(async (page, { append = false, silent = false } = {}) => {
    if (!silent) setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const payload = await getNotifications({ per_page: PER_PAGE, page, filter });
      const items = payload.data || [];
      setState((current) => {
        let merged = items;
        if (append) {
          merged = [...current.items, ...items.filter((item) => !current.items.some((existing) => existing.id === item.id))];
        } else if (silent && current.page > 1) {
          // Live refresh keeps the pages already loaded and adds what is new on top.
          const fresh = new Map(items.map((item) => [item.id, item]));
          const known = current.items.map((item) => fresh.get(item.id) || item);
          merged = [...items.filter((item) => !current.items.some((existing) => existing.id === item.id)), ...known];
        }
        return {
          items: merged,
          page: append ? page : Math.max(page, silent ? current.page : page),
          lastPage: payload.meta?.last_page ?? 1,
          unread: payload.meta?.unread_count ?? 0,
          loading: false,
          error: null,
        };
      });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error }));
    }
  }, [filter]);

  useEffect(() => { load(1); }, [load]);
  useLiveRefresh(useCallback(() => load(1, { silent: true }), [load]));

  function open(note) {
    if (!note.read) {
      setState((current) => ({
        ...current,
        unread: Math.max(0, current.unread - 1),
        items: current.items.map((item) => (item.id === note.id ? { ...item, read: true } : item)),
      }));
      markNotificationRead(note.id).catch(() => {});
    }
    if (note.href) navigate(note.href);
  }

  async function markAll() {
    setState((current) => ({ ...current, unread: 0, items: current.items.map((item) => ({ ...item, read: true })) }));
    try {
      await markAllNotificationsRead();
      toast.success('All notifications marked as read.');
      if (filter === 'unread') load(1, { silent: true });
    } catch (error) {
      toast.error(error);
    }
  }

  const { items, page, lastPage, unread, loading, error } = state;

  return (
    <main className="ec-main" style={{ paddingTop: 28 }}>
      <div className="ec-container ec-stack" style={{ maxWidth: 820 }}>
        <div className="ec-page-head">
          <div>
            <h1 className="ec-h1">Activity</h1>
            <p className="ec-sub">Everything that happened on your account — updates appear here as they happen.</p>
          </div>
          <div className="ec-actions">
            {unread > 0 && <Button variant="secondary" onClick={markAll}>Mark all read</Button>}
            <Button variant="outline" to="/settings?section=notifications">Notification settings</Button>
          </div>
        </div>

        <section className="ec-card ec-activity" aria-label="Notifications">
          <div className="ec-card-head">
            <Tabs tabs={TABS.map((tab) => (tab.key === 'unread' ? { ...tab, count: unread } : tab))} value={filter} onChange={setFilter} label="Filter notifications" />
          </div>
          {loading && items.length === 0 && [0, 1, 2, 3].map((key) => <div className="ec-row" key={key}><Skeleton height={44} /></div>)}
          {error && <ErrorState error={error} onRetry={() => load(1)} />}
          {!loading && !error && items.length === 0 && (
            <EmptyState title={filter === 'unread' ? 'You’re all caught up' : 'No activity yet'}>
              {filter === 'unread'
                ? <>Nothing unread. <Link to="#" onClick={(event) => { event.preventDefault(); setFilter('all'); }}>See all activity</Link></>
                : 'Applications, messages, profile views and reviews will show up here.'}
            </EmptyState>
          )}
          {items.map((note) => (
            <button key={note.id} type="button" className={`ec-note ${note.read ? '' : 'is-unread'}`} onClick={() => open(note)}>
              <span className={`ec-note-icon tone-${NOTE_TONES[note.tone] || 'purple'}`}>{note.initials || '•'}</span>
              <span className="ec-note-text">{note.title}<small>{timeAgo(note.created_at)}</small></span>
              <span className="ec-note-dot" />
            </button>
          ))}
          {page < lastPage && items.length > 0 && (
            <div className="ec-row" style={{ justifyItems: 'center' }}>
              <Button variant="secondary" size="sm" loading={loading} onClick={() => load(page + 1, { append: true })}>Load more</Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
