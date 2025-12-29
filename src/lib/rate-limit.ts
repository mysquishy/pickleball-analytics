/**
 * Simple in-memory rate limiter
 * For production, use Redis or a rate limiting service
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

// Clean up old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.resetTime < now) {
      store.delete(key);
    }
  }
}, 60000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

export const RATE_LIMITS = {
  API: { interval: 60000, maxRequests: 60 }, // 60 requests per minute
  AUTH: { interval: 900000, maxRequests: 5 }, // 5 requests per 15 minutes
  STRICT: { interval: 60000, maxRequests: 10 }, // 10 requests per minute
} as const;

/**
 * Check if request should be rate limited
 * Returns true if rate limit exceeded
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.API
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `${identifier}:${config.interval}`;

  let record = store.get(key);

  if (!record || record.resetTime < now) {
    // New window
    record = {
      count: 1,
      resetTime: now + config.interval,
    };
    store.set(key, record);

    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: record.resetTime,
    };
  }

  record.count++;

  if (record.count > config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  return {
    limited: false,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Rate limit middleware helper
 */
export function rateLimit(config?: RateLimitConfig) {
  return (identifier: string) => checkRateLimit(identifier, config);
}
