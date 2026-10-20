/**
 * Central HTTP client for the Laravel API.
 *
 * - First-party browser auth uses Sanctum's HTTP-only session cookie + XSRF token
 *   (no bearer tokens in browser storage).
 * - Every response uses the envelope { success, message, data, meta?, errors? }.
 * - Failures throw ApiError with a user-friendly message per status code.
 */

// VITE_API_BASE_URL may be absolute (separate API host) or relative such as
// '/api/v1' when the SPA and Laravel are served from the same public_html.
// Both production and development default to the page's own origin: in development
// the Vite server proxies /api, /sanctum and /oauth to Laravel (see vite.config.js).
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiBaseUrl = new URL(configuredBaseUrl, window.location.origin).toString().replace(/\/+$/, '');
export const apiRootUrl = apiBaseUrl.replace(/\/api\/v\d+$/, '');

const STATUS_MESSAGES = {
  0: 'We couldn’t reach Educator Connect. Check your connection and try again.',
  400: 'That request couldn’t be understood. Please try again.',
  401: 'Please sign in to continue.',
  403: 'You don’t have permission to do that.',
  404: 'We couldn’t find what you were looking for.',
  413: 'That file is too large.',
  419: 'Your session expired. Please refresh the page and try again.',
  422: 'Please check the highlighted fields.',
  429: 'Too many attempts. Please wait a moment and try again.',
  500: 'Something went wrong on our side. Please try again.',
  503: 'Educator Connect is temporarily unavailable. Please try again shortly.',
};

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** First validation message for a field, e.g. error.field('email'). */
  field(name) {
    const value = this.errors?.[name];
    return Array.isArray(value) ? value[0] : value;
  }
}

let unauthorizedHandler = null;

/** The auth layer registers a handler so an expired session signs the user out everywhere. */
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

function readCookie(name) {
  const match = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

let csrfPromise = null;

/**
 * Some hosts put a caching proxy (e.g. cPanel's NGINX cache) in front of the app that
 * ignores Cache-Control. A unique query value makes every API read reach Laravel.
 */
const cacheBuster = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function ensureCsrfCookie(force = false) {
  if (!force && readCookie('XSRF-TOKEN')) return;
  if (!csrfPromise) {
    csrfPromise = fetch(`${apiRootUrl}/sanctum/csrf-cookie?_=${cacheBuster()}`, { credentials: 'include', cache: 'no-store' })
      .then((response) => {
        if (!response.ok || !readCookie('XSRF-TOKEN')) {
          throw new ApiError('Could not establish a secure session with the API.', response.ok ? 0 : response.status);
        }
      })
      .finally(() => { csrfPromise = null; });
  }
  await csrfPromise;
}

function buildUrl(path, query) {
  const url = new URL(`${apiBaseUrl}${path}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) return;
    url.searchParams.set(key, Array.isArray(value) ? value.join(',') : value === true ? '1' : String(value));
  });
  return url.toString();
}

/**
 * @param {string} path  e.g. '/jobs'
 * @param {{ method?: string, body?: object|FormData, query?: object, signal?: AbortSignal, raw?: boolean }} options
 * @returns {Promise<{ data: any, meta?: object, message: string }>}
 */
export async function request(path, { method = 'GET', body, query, signal, raw = false } = {}, retried = false) {
  const isWrite = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const headers = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body && !isForm) headers['Content-Type'] = 'application/json';
  if (isWrite) {
    await ensureCsrfCookie();
    const token = readCookie('XSRF-TOKEN');
    if (token) headers['X-XSRF-TOKEN'] = token;
  }

  let response;
  try {
    response = await fetch(buildUrl(path, isWrite ? query : { ...query, _: cacheBuster() }), {
      method,
      headers,
      cache: 'no-store',
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      credentials: 'include',
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(STATUS_MESSAGES[0], 0);
  }

  // Stale CSRF token: refresh it once and retry.
  if (response.status === 419 && isWrite && !retried) {
    await ensureCsrfCookie(true);
    return request(path, { method, body, query, signal, raw }, true);
  }

  if (raw && response.ok) return response;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    if (!response.ok) throw new ApiError(STATUS_MESSAGES[response.status] || STATUS_MESSAGES[500], response.status);
    throw new ApiError('The server returned an unexpected response.', response.status);
  }

  if (!response.ok) throw failure(response.status, payload);

  return payload;
}

/** Builds the ApiError for a failed response (and signs the user out on 401). */
function failure(status, payload) {
  if (status === 401 && unauthorizedHandler) unauthorizedHandler();
  const fallback = STATUS_MESSAGES[status] || STATUS_MESSAGES[500];
  const message = status >= 500 ? fallback : payload?.message || fallback;
  return new ApiError(message, status, payload?.errors || {});
}

/**
 * Multipart POST that reports upload progress. fetch() can't observe request-body
 * progress, so this uses XMLHttpRequest with the same CSRF, envelope and error handling.
 *
 * @param {(progress: { loaded: number, total: number, percent: number }) => void} onProgress
 */
async function uploadWithProgress(path, form, { onProgress, signal } = {}, retried = false) {
  await ensureCsrfCookie();
  const token = readCookie('XSRF-TOKEN');

  const { status, text } = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', buildUrl(path));
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (token) xhr.setRequestHeader('X-XSRF-TOKEN', token);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress({ loaded: event.loaded, total: event.total, percent: Math.min(100, Math.round((event.loaded / event.total) * 100)) });
    };
    xhr.onload = () => resolve({ status: xhr.status, text: xhr.responseText });
    xhr.onerror = () => reject(new ApiError(STATUS_MESSAGES[0], 0));
    xhr.onabort = () => reject(new DOMException('The upload was cancelled.', 'AbortError'));

    if (signal?.aborted) {
      reject(new DOMException('The upload was cancelled.', 'AbortError'));
      return;
    }
    signal?.addEventListener('abort', () => xhr.abort(), { once: true });
    xhr.send(form);
  });

  // Stale CSRF token: refresh it once and retry from 0%.
  if (status === 419 && !retried) {
    await ensureCsrfCookie(true);
    onProgress({ loaded: 0, total: 0, percent: 0 });
    return uploadWithProgress(path, form, { onProgress, signal }, true);
  }

  let payload = null;
  try {
    payload = JSON.parse(text);
  } catch {
    if (status < 200 || status >= 300) throw new ApiError(STATUS_MESSAGES[status] || STATUS_MESSAGES[500], status);
    throw new ApiError('The server returned an unexpected response.', status);
  }

  if (status < 200 || status >= 300) throw failure(status, payload);
  return payload;
}

/** True when a request or upload was cancelled on purpose (AbortController / Cancel button). */
export const isAbortError = (error) => error?.name === 'AbortError';

export const api = {
  get: (path, query, options) => request(path, { ...options, query }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  /** Pass `{ onProgress, signal }` to get upload progress events and allow cancelling. */
  upload: (path, fields, options = {}) => {
    const form = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((item) => form.append(`${key}[]`, item));
      else if (value !== undefined && value !== null) form.append(key, value);
    });
    if (options.onProgress) return uploadWithProgress(path, form, options);
    return request(path, { signal: options.signal, method: 'POST', body: form });
  },
  /** Downloads an authenticated file (résumé, data export) and saves it in the browser. */
  async download(path, fallbackName) {
    const response = await request(path, { raw: true });
    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
    const name = match ? decodeURIComponent(match[1]) : fallbackName;
    const url = URL.createObjectURL(await response.blob());
    const link = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
