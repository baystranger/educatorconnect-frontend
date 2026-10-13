/*
 * Static marketing copy for the public pages (from the design).
 * Live listings — jobs, centres, professionals — come from the API, never from here.
 */

export const searchTabs = {
  care: {
    label: 'Childcare',
    fields: [
      ['location', 'Location', 'City or postal code'],
      ['age', "Child's age", 'Infant, toddler, preschool…'],
      ['program', 'Program', 'Any program'],
    ],
    chips: [
      ['Infant care', '/childcare?age_group=infant'],
      ['Spaces available now', '/childcare?spaces_available=1'],
      ['Before & after school', '/childcare?schedule=before_after_school'],
      ['Accepting waitlist', '/childcare?accepting_waitlist=1'],
    ],
    note: 'No account needed — contact centres, book tours and join waitlists directly.',
    button: 'Find childcare',
  },
  jobs: {
    label: 'Jobs',
    fields: [
      ['keyword', 'Role', 'Job title or keyword'],
      ['location', 'Location', 'City or postal code'],
      ['type', 'Type', 'Full-time, practicum…'],
    ],
    chips: [
      ['Full-time ECE', '/jobs?employment_types=full_time'],
      ['Practicum placements', '/jobs?employment_types=practicum'],
      ['Substitute / on-call', '/jobs?employment_types=substitute'],
      ['Infant / toddler', '/jobs?category=infant_toddler_educator'],
    ],
    note: 'ECE student? Switch on practicum mode after you sign up.',
    button: 'Search jobs',
  },
  pros: {
    label: 'Professionals',
    fields: [
      ['keyword', 'Service', 'Speech therapy, licensing, design…'],
      ['location', 'Location', 'City or service area'],
    ],
    chips: [
      ['Licensing consultants', '/?service=licensing#directory'],
      ['Speech-language pathologists', '/?service=speech#directory'],
      ['Bookkeepers', '/?service=bookkeep#directory'],
      ['Playground designers', '/?service=playground#directory'],
    ],
    note: 'Only verified or claimed listings show a badge.',
    button: 'Find services',
  },
};

export const audiences = [
  {
    eyebrow: 'For parents',
    title: 'Find childcare you feel good about.',
    points: [
      'Search by location, age and program',
      'Watch welcome videos, see availability',
      'Book tours or join waitlists — no account',
    ],
    action: 'Search childcare',
    href: '/childcare',
    link: 'Parent guides',
    linkHref: '/#footer',
    tone: 'lavender',
  },
  {
    eyebrow: 'For educators',
    title: 'Get hired for who you are.',
    points: [
      'Jobs and practicums within your radius',
      'A profile with intro video and philosophy',
      'Apply in minutes and track every status',
    ],
    action: 'Browse jobs',
    href: '/jobs',
    link: 'Create profile',
    linkHref: '/signup?type=educator',
    tone: 'green',
  },
  {
    eyebrow: 'For childcare centres',
    title: 'Hire, showcase and grow.',
    points: [
      'Post jobs and manage applicants',
      'A public profile families and educators trust',
      'Find reliable services in the directory',
    ],
    action: 'Post a job',
    href: '/signup?type=centre',
    link: 'Create centre profile',
    linkHref: '/signup?type=centre',
    tone: 'ink',
  },
];

/** Homepage job filter pills → API employment type. */
export const jobFilters = [
  ['all', 'All roles', null],
  ['ft', 'Full-time', 'full_time'],
  ['pt', 'Part-time', 'part_time'],
  ['cs', 'Casual', 'casual'],
  ['sb', 'Substitute', 'substitute'],
  ['pr', 'Practicum', 'practicum'],
];

/** Homepage directory filter pills → API category group. */
export const professionalFilters = [
  ['all', 'All services', null],
  ['therapy', 'Therapy & development', 'therapy'],
  ['biz', 'Licensing & business', 'business'],
  ['learn', 'Training & curriculum', 'training'],
  ['space', 'Spaces & design', 'design'],
];

export const trustItems = [
  { title: 'Verified centres', description: 'Reviewed by our team, with licensing shown only once validated.', tone: 'green' },
  { title: 'Verified educators', description: 'Certifications checked where applicable; record-check status is educator-controlled.', tone: 'lavender' },
  { title: 'Claimed professionals', description: 'Ownership confirmed before anyone can edit a listing.', tone: 'gold' },
  { title: 'Privacy first', description: 'Child information in inquiries is kept to what the centre needs.', tone: 'blue' },
];

export const footerColumns = [
  { title: 'Find childcare', links: [{ label: 'Search centres', href: '/childcare' }, { label: 'Parent resources', href: '/#footer' }, { label: 'Tours & waitlists', href: '/childcare' }] },
  { title: 'Jobs', links: [{ label: 'Browse jobs', href: '/jobs' }, { label: 'For educators', href: '/signup?type=educator' }, { label: 'For ECE students', href: '/jobs?employment_types=practicum' }] },
  { title: 'For centres', links: [{ label: 'Create centre profile', href: '/signup?type=centre' }, { label: 'Post a job', href: '/signup?type=centre' }, { label: 'Find educators', href: '/signup?type=centre' }, { label: 'Practicum opportunities', href: '/jobs?employment_types=practicum' }] },
  { title: 'Directory', links: [{ label: 'Search professionals', href: '/#directory' }, { label: 'Browse categories', href: '/#directory' }, { label: 'Add your profile', href: '/signup' }, { label: 'Claim your profile', href: '/#directory' }] },
  { title: 'Company', links: [{ label: 'About', href: '/#footer' }, { label: 'Resources', href: '/#footer' }, { label: 'Help Centre', href: '/#footer' }, { label: 'Contact', href: '/#footer' }] },
];

export const mobileFooterColumns = [
  { title: 'Find Childcare', links: [{ label: 'Search centres', href: '/childcare' }, { label: 'Parent resources', href: '/#footer' }] },
  { title: 'Jobs', links: [{ label: 'Browse jobs', href: '/jobs' }, { label: 'For ECE students', href: '/jobs?employment_types=practicum' }] },
  { title: 'For Centres', links: [{ label: 'Create profile', href: '/signup?type=centre' }, { label: 'Post a job', href: '/signup?type=centre' }, { label: 'Find educators', href: '/signup?type=centre' }] },
  { title: 'Directory', links: [{ label: 'Search professionals', href: '/#directory' }, { label: 'Add your profile', href: '/signup' }, { label: 'Claim your profile', href: '/#directory' }] },
];
