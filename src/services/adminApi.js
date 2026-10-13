import { api } from '../lib/api.js';

export const getModerationOverview = (options) => api.get('/admin/overview', undefined, options);

export const getAdminListings = (status, options) => api.get('/admin/listings', { status }, options);
export const moderateListing = (id, action, notes) => api.post(`/admin/listings/${id}/${action}`, { notes });

export const getAdminClaims = (status, options) => api.get('/admin/claims', { status }, options);
export const moderateClaim = (id, action, notes) => api.post(`/admin/claims/${id}/${action}`, { notes });
export const downloadClaimDocument = (id) => api.download(`/admin/claims/${id}/document`, `claim-${id}`);

export const getAdminCredentials = (status, options) => api.get('/admin/credentials', { status }, options);
export const setCredentialStatus = (id, status) => api.put(`/admin/credentials/${id}`, { status });

export const getAdminCentres = (status, q, options) => api.get('/admin/centres', { status, q }, options);
export const moderateCentre = (id, action) => api.post(`/admin/centres/${id}/${action}`);
