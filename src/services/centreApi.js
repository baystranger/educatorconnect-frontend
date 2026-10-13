import { api } from '../lib/api.js';

/** Childcare centre workspace endpoints (role: childcare_centre). */

export const getCentreDashboard = (options) => api.get('/centre/dashboard', undefined, options);

// Profile builder
export const getCentreProfile = (options) => api.get('/centre/profile', undefined, options);
/** section: basics | about | programs | media | team | parents */
export const updateCentreSection = (section, data) => api.put(`/centre/profile/${section}`, data);
export const uploadCentreLogo = (file) => api.upload('/centre/profile/media/image', { file });
export const uploadWelcomeVideo = (file, title) => api.upload('/centre/profile/media/video', { file, title });
export const removeWelcomeVideo = () => api.delete('/centre/profile/media/video');
export const uploadTeamPhoto = (memberId, file) => api.upload(`/centre/profile/team/${memberId}/photo`, { file });
export const submitCentreProfile = () => api.post('/centre/profile/submit', { confirm: true });

export const addGalleryPhotos = (files, category) => api.upload('/centre/gallery', { files, category });
export const updateGalleryItem = (id, data) => api.put(`/centre/gallery/${id}`, data);
export const setGalleryCover = (id) => api.post(`/centre/gallery/${id}/cover`);
export const deleteGalleryItem = (id) => api.delete(`/centre/gallery/${id}`);
export const uploadCentreResource = (file, title, description) => api.upload('/centre/resources', { file, title, description });
export const deleteCentreResource = (id) => api.delete(`/centre/resources/${id}`);

// Job postings
export const getCentreJobs = (query, options) => api.get('/centre/jobs', query, options);
export const getCentreJob = (id, options) => api.get(`/centre/jobs/${id}`, undefined, options);
export const createJob = (data) => api.post('/centre/jobs', data);
export const updateJob = (id, data) => api.put(`/centre/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/centre/jobs/${id}`);
/** action: publish | close | archive | duplicate */
export const jobAction = (id, action) => api.post(`/centre/jobs/${id}/${action}`);

// Applicants
export const getApplicants = (jobId, status, options) => api.get(`/centre/jobs/${jobId}/applicants`, { status }, options);
export const getApplicant = (applicationId, options) => api.get(`/centre/applications/${applicationId}`, undefined, options);
export const setApplicantStatus = (applicationId, data) => api.put(`/centre/applications/${applicationId}/status`, data);
export const messageApplicant = (applicationId, body) => api.post(`/centre/applications/${applicationId}/messages`, { body });
export const downloadApplicantResume = (applicationId, name) => api.download(`/centre/applications/${applicationId}/resume`, name || 'resume');

// Families
export const getFamilies = (type, options) => api.get('/centre/families', { type }, options);
export const getFamilyRequest = (id, options) => api.get(`/centre/families/${id}`, undefined, options);
export const replyToFamily = (id, body) => api.post(`/centre/families/${id}/reply`, { body });
export const setFamilyRequestStatus = (id, data) => api.put(`/centre/families/${id}/status`, data);
