import { api, apiRootUrl } from '../lib/api.js';

export { ApiError } from '../lib/api.js';

const DEVICE_NAME = 'Educator Connect web';

export async function registerAccount(data) {
  const payload = await api.post('/auth/register', { ...data, device_name: DEVICE_NAME });
  return payload.data;
}

export async function loginAccount(data) {
  const payload = await api.post('/auth/login', { ...data, device_name: DEVICE_NAME });
  return payload.data;
}

/** The signed-in user, or null for guests. */
export async function getCurrentUser(options) {
  const payload = await api.get('/auth/session', undefined, options);
  return payload.data;
}

export function logoutAccount() {
  return api.post('/auth/logout');
}

/** OAuth starts on the API's web routes (session-backed for Socialite state). */
export function getSocialLoginUrl(provider, intent, role) {
  const url = new URL(`/oauth/${provider}/redirect`, apiRootUrl);
  url.searchParams.set('intent', intent);
  if (role) url.searchParams.set('role', role);
  return url.toString();
}

/** Name/email the provider shared for a Google/LinkedIn sign-up still in progress. */
export async function getPendingSocialSignup(token) {
  const payload = await api.post('/auth/oauth/pending', { token });
  return payload.data;
}

/** Finishes a Google/LinkedIn sign-up with the details the provider doesn't share. */
export async function registerSocialAccount(data) {
  const payload = await api.post('/auth/register/social', { ...data, device_name: DEVICE_NAME });
  return payload.data;
}

export async function exchangeOAuthCode(code) {
  const payload = await api.post('/auth/oauth/exchange', { code, device_name: DEVICE_NAME });
  return payload.data;
}

export function requestPasswordReset(email) {
  return api.post('/auth/forgot-password', { email });
}

export function resetPassword(data) {
  return api.post('/auth/reset-password', data);
}

export function resendVerificationEmail() {
  return api.post('/auth/email/verification-notification');
}

export function disconnectProvider(provider) {
  return api.delete(`/auth/providers/${provider}`);
}
