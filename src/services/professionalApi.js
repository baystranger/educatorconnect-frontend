import { api } from '../lib/api.js';

// ── My listings & claims ─────────────────────────────────────────
export const getMyListings = (options) => api.get('/professional/listings', undefined, options);
export const createListing = (data) => api.post('/professionals', data);
export const updateListing = (id, data) => api.put(`/professional/listings/${id}`, data);
export const uploadListingLogo = (id, file) => api.upload(`/professional/listings/${id}/logo`, { file });

// ── Claiming an existing directory listing ───────────────────────
export const claimListing = (id, fields) => api.upload(`/professionals/${id}/claim`, fields);
