import { api } from '../lib/api.js';

/** Public (no account needed) endpoints: search, centre profiles, jobs, directory. */

export const searchCentres = (filters, options) => api.get('/childcare-centres', filters, options);
export const getCentre = (slug, query, options) => api.get(`/childcare-centres/${encodeURIComponent(slug)}`, query, options);
export const getCentreJobs = (slug, options) => api.get(`/childcare-centres/${encodeURIComponent(slug)}/jobs`, undefined, options);
export const sendParentRequest = (slug, data) => api.post(`/childcare-centres/${encodeURIComponent(slug)}/requests`, data);

export const searchJobs = (filters, options) => api.get('/jobs', filters, options);
export const getJob = (slug, options) => api.get(`/jobs/${encodeURIComponent(slug)}`, undefined, options);

export const getEducatorProfile = (slug, options) => api.get(`/educators/${encodeURIComponent(slug)}`, undefined, options);

export const searchProfessionals = (filters, options) => api.get('/professionals', filters, options);
export const getProfessionalCategories = (options) => api.get('/professionals/categories', undefined, options);

export const getOptions = (options) => api.get('/meta/options', undefined, options);
