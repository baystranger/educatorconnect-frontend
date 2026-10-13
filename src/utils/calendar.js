/** Builds a downloadable .ics file so interviews and tours can be added to any calendar. */
export function icsDataUrl({ title, start, durationMinutes = 45, location = '', description = '' }) {
  const begin = new Date(start);
  const end = new Date(begin.getTime() + durationMinutes * 60000);
  const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const escape = (text) => String(text).replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Educator Connect//EN', 'BEGIN:VEVENT',
    `UID:${stamp(begin)}-${Math.random().toString(36).slice(2)}@educatorconnect`,
    `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(begin)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(title)}`, `LOCATION:${escape(location)}`, `DESCRIPTION:${escape(description)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`;
}
