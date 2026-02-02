/**
 * Rate Limiter Service
 * Prevents abuse of the Gemini API with configurable request limits
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // time window in milliseconds
}

class RateLimiter {
  private requestTimestamps: number[] = [];
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }) {
    this.config = config;
  }

  /**
   * Check if a request is allowed
   * @returns { allowed: boolean, retryAfter?: number }
   */
  isAllowed(): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Remove timestamps outside the current window
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => timestamp > windowStart
    );

    // Check if limit exceeded
    if (this.requestTimestamps.length >= this.config.maxRequests) {
      const oldestRequest = this.requestTimestamps[0];
      const retryAfter = Math.ceil(
        (oldestRequest + this.config.windowMs - now) / 1000
      );
      return { allowed: false, retryAfter };
    }

    // Add current request
    this.requestTimestamps.push(now);
    return { allowed: true };
  }

  /**
   * Get remaining requests in current window
   */
  getRemainingRequests(): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    const recentRequests = this.requestTimestamps.filter(
      (timestamp) => timestamp > windowStart
    );

    return Math.max(0, this.config.maxRequests - recentRequests.length);
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.requestTimestamps = [];
  }
}

// Create a singleton instance: max 15 requests per minute
export const chatRateLimiter = new RateLimiter({
  maxRequests: 15,
  windowMs: 60000, // 1 minute
});

export default RateLimiter;
