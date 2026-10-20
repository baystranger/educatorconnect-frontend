import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useBlocker } from 'react-router-dom';
import { Button, Modal } from '../components/ui/index.jsx';

const UnsavedChangesContext = createContext(null);

/**
 * One app-wide "leave without saving?" guard. React Router allows a single active
 * blocker, so forms register here (useUnsavedChanges) instead of each calling useBlocker.
 * Must be rendered inside the data router.
 */
export function UnsavedChangesProvider({ children }) {
  const entries = useRef(new Map());
  const [, setVersion] = useState(0);
  const [saving, setSaving] = useState(false);

  const dirtyEntries = () => [...entries.current.values()].filter((entry) => entry.dirty);

  const blocker = useBlocker(useCallback(({ currentLocation, nextLocation }) => (
    (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search)
    && [...entries.current.values()].some((entry) => entry.dirty)
  ), []));

  const anyDirty = dirtyEntries().length > 0;
  useEffect(() => {
    if (!anyDirty) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [anyDirty]);

  const registry = useMemo(() => ({
    set(id, entry) {
      const before = Boolean(entries.current.get(id)?.dirty);
      entries.current.set(id, entry);
      if (before !== Boolean(entry.dirty)) setVersion((v) => v + 1);
    },
    release(id) {
      const entry = entries.current.get(id);
      if (entry?.dirty) registry.set(id, { ...entry, dirty: false });
    },
    remove(id) {
      const had = Boolean(entries.current.get(id)?.dirty);
      entries.current.delete(id);
      if (had) setVersion((v) => v + 1);
    },
  }), []);

  const blocked = blocker.state === 'blocked';
  const pending = blocked ? dirtyEntries() : [];
  const canSave = pending.length > 0 && pending.every((entry) => entry.save);
  const message = pending.find((entry) => entry.message)?.message || 'You have unsaved changes on this page. What would you like to do?';

  function discard() {
    pending.forEach((entry) => entry.discard?.());
    entries.current.forEach((entry, id) => { if (entry.dirty) entries.current.set(id, { ...entry, dirty: false }); });
    blocker.proceed?.();
  }

  async function saveAndLeave() {
    setSaving(true);
    try {
      for (const entry of pending) {
        // eslint-disable-next-line no-await-in-loop
        if (!(await entry.save())) { blocker.reset?.(); return; }
      }
      entries.current.forEach((entry, id) => { if (entry.dirty) entries.current.set(id, { ...entry, dirty: false }); });
      blocker.proceed?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <UnsavedChangesContext.Provider value={registry}>
      {children}
      <Modal open={blocked} title={pending.some((entry) => entry.uploading) ? 'Upload in progress' : 'Unsaved changes'} onClose={() => !saving && blocker.reset?.()}
        footer={(
          <>
            <Button variant="outline" onClick={() => blocker.reset?.()} disabled={saving}>Keep editing</Button>
            <Button variant="danger" onClick={discard} disabled={saving}>{pending.some((entry) => entry.uploading) ? 'Cancel upload & leave' : 'Discard'}</Button>
            {canSave && <Button onClick={saveAndLeave} loading={saving}>{pending[0].saveLabel || 'Save & leave'}</Button>}
          </>
        )}>
        <p className="ec-muted" style={{ margin: 0 }}>{message}</p>
      </Modal>
    </UnsavedChangesContext.Provider>
  );
}

/**
 * Registers a form (or an in-flight upload) with the leave guard.
 *
 * @param {boolean} dirty  true while there is something the user would lose
 * @param {{ onSave?: () => Promise<boolean>, onDiscard?: () => void, saveLabel?: string, message?: string, uploading?: boolean }} options
 *   onSave must resolve true on success; without it the dialog offers only Keep editing / Discard.
 * @returns {{ release: () => void }} call release() right before navigating away after a successful save.
 */
export function useUnsavedChanges(dirty, { onSave, onDiscard, saveLabel, message, uploading = false } = {}) {
  const registry = useContext(UnsavedChangesContext);
  if (!registry) throw new Error('useUnsavedChanges must be used inside <UnsavedChangesProvider>.');
  const id = useId();
  const latest = useRef({ onSave, onDiscard });
  latest.current = { onSave, onDiscard };
  const hasSave = Boolean(onSave);

  useEffect(() => {
    registry.set(id, {
      dirty: Boolean(dirty),
      save: hasSave ? () => latest.current.onSave() : null,
      discard: () => latest.current.onDiscard?.(),
      saveLabel,
      message,
      uploading,
    });
  }, [registry, id, dirty, hasSave, saveLabel, message, uploading]);

  useEffect(() => () => registry.remove(id), [registry, id]);

  return { release: useCallback(() => registry.release(id), [registry, id]) };
}
