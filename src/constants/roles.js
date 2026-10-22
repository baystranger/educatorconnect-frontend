/**
 * Role registry. Adding a role means adding an entry here (home route, nav, menu)
 * plus its routes — no role checks scattered through components.
 * The backend enforces the same roles on every endpoint.
 */
export const ROLES = {
  EDUCATOR: 'educator',
  CENTRE: 'childcare_centre',
  PROFESSIONAL: 'professional',
  ADMINISTRATOR: 'administrator',
};

export const ROLE_CONFIG = {
  [ROLES.EDUCATOR]: {
    label: 'Educator account',
    home: '/educator/dashboard',
    avatarTone: 'green',
    nav: [
      { id: 'dashboard', label: 'Dashboard', to: '/educator/dashboard' },
      { id: 'jobs', label: 'Find jobs', to: '/educator/jobs' },
      { id: 'myjobs', label: 'My jobs', to: '/educator/my-jobs' },
      { id: 'profile', label: 'Profile', to: '/educator/profile' },
    ],
    menu: [
      { label: 'View my profile', to: '/educator/profile' },
      { label: 'Account settings', to: '/settings' },
      { label: 'Notification settings', to: '/settings?section=notifications' },
      { label: 'Help Centre', to: '/#footer' },
    ],
    notificationsHref: '/notifications',
  },
  [ROLES.CENTRE]: {
    label: 'Childcare centre account',
    home: '/centre/dashboard',
    avatarTone: 'gold',
    nav: [
      { id: 'dashboard', label: 'Dashboard', to: '/centre/dashboard' },
      { id: 'jobs', label: 'Job postings', to: '/centre/jobs' },
      { id: 'applicants', label: 'Applicants', to: '/centre/applicants' },
      { id: 'families', label: 'Families', to: '/centre/families' },
      { id: 'profile', label: 'Centre profile', to: '/centre/profile/basics' },
      { id: 'directory', label: 'Find services', to: '/#directory' },
    ],
    menu: [
      { label: 'View public profile', to: 'public-profile' },
      { label: 'Edit centre profile', to: '/centre/profile/basics' },
      { label: 'Account settings', to: '/settings' },
      { label: 'Help Centre', to: '/#footer' },
    ],
    notificationsHref: '/notifications',
  },
  [ROLES.PROFESSIONAL]: {
    label: 'Professional account',
    home: '/professional',
    avatarTone: 'blue',
    nav: [
      { id: 'listings', label: 'My listings', to: '/professional' },
      { id: 'directory', label: 'Directory', to: '/#directory' },
    ],
    menu: [
      { label: 'Add a listing', to: '/professional/listings/new' },
      { label: 'Account settings', to: '/settings' },
      { label: 'Help Centre', to: '/#footer' },
    ],
    notificationsHref: '/notifications',
  },
  [ROLES.ADMINISTRATOR]: {
    label: 'Administrator',
    home: '/admin',
    avatarTone: 'purple',
    nav: [
      { id: 'moderation', label: 'Moderation', to: '/admin' },
      { id: 'site', label: 'View site', to: '/' },
    ],
    menu: [
      { label: 'Account settings', to: '/settings' },
    ],
    notificationsHref: '/notifications',
  },
};

export function homePathFor(user) {
  return ROLE_CONFIG[user?.role]?.home || '/';
}
