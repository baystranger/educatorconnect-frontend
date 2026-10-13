/** Client-side checks that mirror the API's rules (the API remains authoritative). */

export const REGIONS = {
  Canada: [
    'British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba', 'Ontario', 'Quebec', 'New Brunswick',
    'Nova Scotia', 'Prince Edward Island', 'Newfoundland and Labrador', 'Yukon', 'Northwest Territories', 'Nunavut',
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
    'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
    'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  ],
};

/** Same rule as the API: 10+ characters with a number and a symbol. */
export function passwordStrength(password) {
  const meetsRule = password.length >= 10 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
  const score = !password ? 0 : !meetsRule
    ? Math.min(2, (password.length >= 6 ? 1 : 0) + (/\d/.test(password) || /[^A-Za-z0-9]/.test(password) ? 1 : 0))
    : password.length >= 14 ? 4 : 3;
  return { score, label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score], valid: meetsRule };
}

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
