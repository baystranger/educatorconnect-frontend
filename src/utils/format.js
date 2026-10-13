/** Display helpers shared by every screen. */

const AVATAR_TONES = ['gold', 'green', 'peach', 'blue', 'purple'];

/** Stable avatar colour for a name (same name → same colour everywhere). */
export function avatarTone(name) {
  let hash = 0;
  for (const char of String(name)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export function initialsOf(name) {
  return String(name || '')
    .split(/[\s-]+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('') || '?';
}

const shortDate = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' });
const weekdayTime = new Intl.DateTimeFormat('en-CA', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const timeOnly = new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit' });

/** Parses "YYYY-MM-DD" as a local date (not UTC) and ISO strings normally. */
export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export const formatShortDate = (value) => (toDate(value) ? shortDate.format(toDate(value)) : '');
export const formatLongDate = (value) => (toDate(value) ? longDate.format(toDate(value)) : '');
export const formatDateTime = (value) => (toDate(value) ? weekdayTime.format(toDate(value)).replace(/\./g, '') : '');
export const formatTime = (value) => (toDate(value) ? timeOnly.format(toDate(value)).replace(/\./g, '').toUpperCase() : '');

/** "2 hours ago", "Yesterday", "3 days ago", "Sep 22". */
export function timeAgo(value) {
  const date = toDate(value);
  if (!date) return '';
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`;
  return shortDate.format(date);
}

/** "1 day", "2 days", "Sep 27" for compact inbox lists. */
export function ageLabel(value) {
  const date = toDate(value);
  if (!date) return '';
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days < 1) return 'Today';
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'}`;
  return shortDate.format(date);
}

/** "today", "yesterday" or "Sep 28" — used in applicant lists. */
export function relativeDay(value) {
  const date = toDate(value);
  if (!date) return '';
  const today = new Date();
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startOf(today) - startOf(date)) / 86400000);
  if (diff === 0) return 'today';
  if (diff === 1) return 'yesterday';
  return shortDate.format(date);
}

export function monthDay(value) {
  const date = toDate(value);
  if (!date) return { month: '', day: '', weekday: '' };
  return {
    month: date.toLocaleString('en-CA', { month: 'short' }).toUpperCase().replace('.', ''),
    weekday: date.toLocaleString('en-CA', { weekday: 'short' }).toUpperCase().replace('.', ''),
    day: date.getDate(),
  };
}

export function daysUntil(value) {
  const date = toDate(value);
  if (!date) return null;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((date.getTime() - start.getTime()) / 86400000);
}

export function km(value) {
  if (value === null || value === undefined) return null;
  return `${Number(value) >= 10 ? Math.round(value) : Number(value).toFixed(1)} km`;
}

export function plural(count, word, pluralWord = `${word}s`) {
  return `${count} ${count === 1 ? word : pluralWord}`;
}

export function fileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Application status → pill tone, matching the design's colour key. */
export const STATUS_TONES = {
  new: 'gray',
  reviewed: 'yellow',
  shortlisted: 'green',
  interview: 'purple',
  offered: 'solid-green',
  hired: 'solid-green',
  not_selected: 'muted',
  withdrawn: 'muted',
  published: 'green',
  draft: 'gray',
  closed: 'danger',
  archived: 'muted',
};

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/** "Thu, Oct 8" */
export function formatDayDate(value) {
  const date = toDate(value);
  return date ? date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }).replace(/\./g, '') : '';
}

/** "Thursday, 10:00 AM" */
export function formatWeekdayTime(value) {
  const date = toDate(value);
  if (!date) return '';
  const weekday = date.toLocaleDateString('en-CA', { weekday: 'long' });
  return `${weekday}, ${formatTime(date)}`;
}
