import { useEffect, useRef } from 'react';

/** Fired on window by the notification bell when new notifications arrive (detail: the new notes). */
export const NOTIFICATIONS_EVENT = 'ec:notifications';

export function announceNotifications(notes) {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT, { detail: notes }));
}

/**
 * Re-loads a page's data in the background whenever new activity arrives, so lists,
 * timelines and message threads stay current without a manual refresh.
 *
 *   const { reload } = useResource(...);
 *   useLiveRefresh(reload);
 */
export function useLiveRefresh(reload) {
  const reloadRef = useRef(reload);
  reloadRef.current = reload;

  useEffect(() => {
    const onNotes = () => reloadRef.current?.({ silent: true });
    window.addEventListener(NOTIFICATIONS_EVENT, onNotes);
    return () => window.removeEventListener(NOTIFICATIONS_EVENT, onNotes);
  }, []);
}
