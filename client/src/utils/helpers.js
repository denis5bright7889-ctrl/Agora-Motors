// client/src/utils/helpers.js — Shared utility functions

/**
 * Format a number as KES currency
 * @param {number} amount
 * @returns {string}  e.g. "KES 1,250,000"
 */
export const formatPrice = (amount) =>
  `KES ${Number(amount).toLocaleString('en-KE')}`;

/**
 * Format mileage with comma separators
 * @param {number} km
 * @returns {string}  e.g. "45,200 km"
 */
export const formatMileage = (km) =>
  `${Number(km).toLocaleString('en-KE')} km`;

/**
 * Relative time — "2 hours ago", "3 days ago", etc.
 * @param {string|Date} date
 */
export const timeAgo = (date) => {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)   return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 2592000) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Build a query string from an object, omitting empty values
 * @param {object} params
 * @returns {string}
 */
export const buildQuery = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) q.set(k, v);
  });
  return q.toString();
};

/**
 * Extract an error message from an Axios error
 * @param {any} error
 * @returns {string}
 */
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';

/**
 * Pluralise a word
 * @param {number} count
 * @param {string} singular
 * @param {string} [plural]
 */
export const pluralise = (count, singular, plural) =>
  `${count} ${count === 1 ? singular : (plural || singular + 's')}`;

/**
 * Truncate text to a given length
 */
export const truncate = (str, len = 80) =>
  str && str.length > len ? str.slice(0, len).trimEnd() + '…' : str;

/**
 * Capitalise first letter
 */
export const capitalise = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Generate an array of page numbers for pagination UI
 * @param {number} current  — current page (1-indexed)
 * @param {number} total    — total pages
 * @param {number} delta    — pages on either side of current
 */
export const paginationRange = (current, total, delta = 2) => {
  const range = [];
  const left  = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total);

  return range;
};

/** Fallback image URL */
export const CAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80';
