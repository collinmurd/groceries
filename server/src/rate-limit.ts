
import { Request, Response, NextFunction } from 'express';

/**
 * Extract the real client IP address from the request
 * Handles proxied requests (nginx, load balancers) and direct connections
 */
function getClientIP(req: Request): string {
  // Check X-Forwarded-For header (set by proxies like nginx)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
    // The first one is the original client
    return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim();
  }

  // Check X-Real-IP header (alternative header)
  const realIP = req.headers['x-real-ip'];
  if (realIP && typeof realIP === 'string') {
    return realIP;
  }

  // Fall back to req.ip (requires trust proxy setting)
  if (req.ip) {
    return req.ip;
  }

  // Last resort: direct socket connection
  return req.socket.remoteAddress || 'unknown';
}

// In-memory rate limit store
// Consider using Redis for production/multi-instance deployments
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup old entries every 15 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 15 * 60 * 1000);

/**
 * Rate limiting middleware to prevent abuse
 * Limits requests per IP address within a time window
 */
export function rateLimitByIPMiddleware(rph: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIP(req);
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // Per 1 hour

    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
      // New window - reset the counter
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= rph) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        retryAfter
      });
    }

    record.count++;
    next();
  }
}
