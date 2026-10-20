import { api } from '../lib/api.js';

/** Educator workspace endpoints (role: educator). */

export const getEducatorDashboard = (options) => api.get('/educator/dashboard', undefined, options);

export const getMyProfile = (options) => api.get('/educator/profile', undefined, options);
export const updateMyProfile = (data) => api.put('/educator/profile', data);
export const setPracticumMode = (enabled) => api.put('/educator/profile/practicum-mode', { enabled });
export const dismissProfileSetup = () => api.post('/educator/profile/dismiss-setup');
/** kind: image (profile photo) | video (intro video) | resume */
export const uploadProfileMedia = (kind, file, options) => api.upload(`/educator/profile/media/${kind}`, { file }, options);
export const removeProfileMedia = (kind) => api.delete(`/educator/profile/media/${kind}`);
export const downloadMyResume = (name) => api.download('/educator/profile/resume', name || 'resume');

export const addCredential = (data) => api.post('/educator/credentials', data);
export const updateCredential = (id, data) => api.put(`/educator/credentials/${id}`, data);
export const deleteCredential = (id) => api.delete(`/educator/credentials/${id}`);

export const getMyApplications = (filter, options) => api.get('/educator/applications', { filter }, options);
export const getMyApplication = (id, options) => api.get(`/educator/applications/${id}`, undefined, options);
export const withdrawApplication = (id) => api.post(`/educator/applications/${id}/withdraw`);
export const replyToCentre = (id, body) => api.post(`/educator/applications/${id}/messages`, { body });

export const applyToJob = (jobId, { coverMessage, shareVideo = true, shareCertifications = true } = {}) => api.post(`/jobs/${jobId}/apply`, {
  cover_message: coverMessage || null,
  share_video: shareVideo,
  share_certifications: shareCertifications,
});
export const getSavedJobs = (options) => api.get('/educator/saved-jobs', undefined, options);
export const saveJob = (jobId) => api.post(`/jobs/${jobId}/save`);
export const unsaveJob = (jobId) => api.delete(`/jobs/${jobId}/save`);
