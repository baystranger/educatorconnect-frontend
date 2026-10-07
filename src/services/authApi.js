const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '');
const apiRootUrl = apiBaseUrl.replace(/\/api\/v\d+$/, '');
const authStorageKey = 'educator-connect-auth';

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const csrfResponse = await fetch(`${apiRootUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
    if (!csrfResponse.ok) {
      throw new ApiError('Could not establish a secure session with the API.', csrfResponse.status);
    }
    const xsrfCookie = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
      ?.slice('XSRF-TOKEN='.length);
    if (!xsrfCookie) {
      throw new ApiError('Could not establish a secure session with the API.', 0);
    }
    headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfCookie);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('The API returned an unreadable response.', response.status);
  }

  if (!response.ok) {
    const validationMessage = Object.values(payload.errors || {}).flat()[0];
    throw new ApiError(validationMessage || payload.message || 'The request could not be completed.', response.status, payload.errors || {});
  }

  return payload;
}

export function saveAuthSession(data) {
  if (!data?.user) {
    throw new ApiError('The API response did not include a valid sign-in session.', 500);
  }

  window.sessionStorage.setItem(authStorageKey, JSON.stringify({
    accessToken: null,
    user: data.user,
  }));
}

export function getAuthSession() {
  const saved = window.sessionStorage.getItem(authStorageKey);
  if (!saved) return null;

  try {
    const session = JSON.parse(saved);
    return session.user ? session : null;
  } catch {
    window.sessionStorage.removeItem(authStorageKey);
    return null;
  }
}

export function clearAuthSession() {
  window.sessionStorage.removeItem(authStorageKey);
}

export async function registerAccount(data) {
  const payload = await request('/auth/register', { method: 'POST', body: data });
  saveAuthSession(payload.data);
  return payload.data;
}

export async function loginAccount(data) {
  const payload = await request('/auth/login', {
    method: 'POST',
    body: { ...data, device_name: 'Educator Connect web' },
  });
  saveAuthSession(payload.data);
  return payload.data;
}

export async function getCurrentUser(token = getAuthSession()?.accessToken) {
  const payload = await request('/auth/me', { token });
  return payload.data;
}

export async function logoutAccount() {
  try {
    await request('/auth/logout', { method: 'POST', token: getAuthSession()?.accessToken });
  } finally {
    clearAuthSession();
  }
}

export function getSocialLoginUrl(provider, intent, role) {
  const url = new URL(`/oauth/${provider}/redirect`, apiBaseUrl);
  url.searchParams.set('intent', intent);
  if (role) url.searchParams.set('role', role);
  return url.toString();
}

export async function exchangeOAuthCode(code) {
  const payload = await request('/auth/oauth/exchange', {
    method: 'POST',
    body: { code, device_name: 'Educator Connect web' },
  });
  saveAuthSession(payload.data);
  return payload.data;
}

export function requestPasswordReset(email) {
  return request('/auth/forgot-password', { method: 'POST', body: { email } });
}

export function resetPassword(data) {
  return request('/auth/reset-password', { method: 'POST', body: data });
}
