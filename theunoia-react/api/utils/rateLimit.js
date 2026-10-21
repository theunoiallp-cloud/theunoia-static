/**
 * In-memory sliding window rate limiter and idempotency store.
 * Protects public confirmation endpoints from spam, automated abuse,
 * and duplicate email dispatches.
 */

// Key: submissionId -> { timestamp, email, type }
const idempotencyStore = new Map();

// Key: clientIp -> array of timestamps
const rateLimitStore = new Map();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;            // Max 6 confirmation dispatches per IP per window
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Periodically purge stale entries from memory
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [id, entry] of idempotencyStore.entries()) {
    if (now - entry.timestamp > IDEMPOTENCY_TTL_MS) {
      idempotencyStore.delete(id);
    }
  }

  for (const [ip, timestamps] of rateLimitStore.entries()) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, valid);
    }
  }
}

// Clean up every 15 minutes
setInterval(cleanupExpired, 15 * 60 * 1000).unref?.();

/**
 * Checks whether an IP has exceeded the allowed rate limit.
 * @param {string} ip
 * @returns {{ allowed: boolean, remaining: number, resetMs: number }}
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const safeIp = ip || 'anonymous';
  const timestamps = (rateLimitStore.get(safeIp) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = timestamps[0];
    const resetMs = RATE_LIMIT_WINDOW_MS - (now - oldest);
    return { allowed: false, remaining: 0, resetMs };
  }

  timestamps.push(now);
  rateLimitStore.set(safeIp, timestamps);
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - timestamps.length,
    resetMs: RATE_LIMIT_WINDOW_MS
  };
}

/**
 * Checks if a confirmation email was already dispatched for this submissionId.
 * If not, marks it as processed.
 * @param {string} submissionId
 * @param {string} email
 * @param {string} type
 * @returns {{ isDuplicate: boolean, previousTimestamp?: number }}
 */
export function checkAndSetIdempotency(submissionId, email, type) {
  if (!submissionId) return { isDuplicate: false };

  if (idempotencyStore.has(submissionId)) {
    const entry = idempotencyStore.get(submissionId);
    return { isDuplicate: true, previousTimestamp: entry.timestamp };
  }

  idempotencyStore.set(submissionId, {
    timestamp: Date.now(),
    email,
    type
  });

  return { isDuplicate: false };
}
