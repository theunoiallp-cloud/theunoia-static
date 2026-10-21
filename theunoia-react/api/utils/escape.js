/**
 * Strict HTML and email header sanitization utilities.
 * Ensures that untrusted user input cannot inject HTML markup, scripts,
 * or arbitrary email headers (CRLF injection).
 */

/**
 * Escapes characters with special meaning in HTML to prevent XSS and HTML injection.
 * @param {string|unknown} val
 * @returns {string}
 */
export function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes single-line strings (such as names or subject fragments)
 * by stripping newlines, carriage returns, and control characters to prevent header injection.
 * @param {string|unknown} val
 * @param {number} [maxLength=150]
 * @returns {string}
 */
export function sanitizeSingleLine(val, maxLength = 150) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[\r\n\t\x00-\x1F\x7F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates standard email address format and rejects CRLF or invalid characters.
 * @param {string|unknown} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  // Rejects any carriage returns or newlines
  if (/[\r\n\t]/.test(trimmed)) return false;
  // Standard RFC 5322 compatible regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(trimmed);
}

/**
 * Validates a standard UUID string (e.g. Supabase generated ID).
 * @param {string|unknown} id
 * @returns {boolean}
 */
export function isValidUuid(id) {
  if (typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id.trim());
}
