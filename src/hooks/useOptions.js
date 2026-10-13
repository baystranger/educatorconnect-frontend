import { useEffect, useState } from 'react';
import { getOptions } from '../services/publicApi.js';

let cache = null;
let pending = null;

/**
 * Shared vocabularies from GET /meta/options (employment types, categories…), fetched
 * once per page load and cached in memory. Returns {} until loaded.
 */
export function useOptions() {
  const [options, setOptions] = useState(cache || {});

  useEffect(() => {
    if (cache) return;
    pending ||= getOptions().then((payload) => {
      cache = payload.data;
      return cache;
    }).catch(() => {
      pending = null;
      return {};
    });
    let active = true;
    pending.then((value) => { if (active) setOptions(value); });
    return () => { active = false; };
  }, []);

  return options;
}

/** Label for an option key, e.g. optionLabel(options.employment_types, 'full_time'). */
export function optionLabel(list, key) {
  return list?.find((item) => item.key === key)?.label || key;
}
