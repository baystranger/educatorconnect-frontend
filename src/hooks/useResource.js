import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Loads data from an API call and tracks loading / error state.
 *
 *   const { data, meta, loading, error, reload, setData } = useResource(
 *     (signal) => getCentreJobs({ tab }, { signal }), [tab]);
 *
 * A new load aborts the previous one, so stale responses never overwrite fresh data.
 */
export function useResource(loader, deps = [], { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, meta: null, loading: enabled, error: null });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const controllerRef = useRef(null);

  const run = useCallback(async ({ silent = false } = {}) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    if (!silent) setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const payload = await loaderRef.current(controller.signal);
      if (!controller.signal.aborted) {
        setState({ data: payload?.data ?? null, meta: payload?.meta ?? null, loading: false, error: null });
      }
      return payload;
    } catch (error) {
      if (error.name !== 'AbortError' && !controller.signal.aborted) {
        setState((current) => ({ ...current, loading: false, error }));
      }
      return null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setState((current) => ({ ...current, loading: false }));
      return undefined;
    }
    run();
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const setData = useCallback((updater) => {
    setState((current) => ({ ...current, data: typeof updater === 'function' ? updater(current.data) : updater }));
  }, []);

  return { ...state, reload: run, setData };
}
