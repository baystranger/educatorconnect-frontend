import { api } from '../lib/api.js';

/** Settings and notifications for any signed-in account. */

export const updateAccount = (data) => api.put('/account', data);
export const changeEmail = (email, currentPassword) => api.put('/account/email', { email, current_password: currentPassword });
export const changePassword = (data) => api.put('/account/password', data);
export const getNotificationPreferences = (options) => api.get('/account/notification-preferences', undefined, options);
export const updateNotificationPreferences = (data) => api.put('/account/notification-preferences', data);
export const downloadMyData = () => api.download('/account/export', 'educator-connect-data.json');
export const deactivateAccount = (password) => api.post('/account/deactivate', { password, confirm: true });

export const getNotifications = (query = {}, options) => api.get('/notifications', { per_page: 8, ...query }, options);
export const markNotificationRead = (id) => api.post(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.post('/notifications/read-all');
