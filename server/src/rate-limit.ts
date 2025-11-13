
import { pino } from 'pino';
import { Request, Response, NextFunction } from 'express';
import { TimeBoxedRecordStore } from './utils/time-boxed-record-store';

const logger = pino();

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

interface RateLimitRecord {
  count: number;
}

/**
 * Rate limiting middleware to prevent abuse
 * Limits requests per IP address within a time window
 */
export function rateLimitByIPMiddleware(rph: number) {
  // const windowMs = 60 * 60 * 1000; // 1 hour
  const windowMs = 60 * 1000; // 1 minute 
  const rateLimitStore = new TimeBoxedRecordStore<RateLimitRecord>(windowMs);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIP(req);
    const record = rateLimitStore.get(ip);

    if (!record) {
      // First request from this IP in the current window
      rateLimitStore.set(ip, { count: 1 });
      return next();
    }

    if (record.count >= rph) {
      // Rate limit exceeded
      logger.warn(`Rate limit exceeded for IP: ${ip} for route ${req.originalUrl}: ${record.count} requests in ${windowMs / 1000} seconds`);
      res.set('Retry-After', String(Math.ceil(windowMs / 1000)));
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Increment counter
    record.count++;
    rateLimitStore.set(ip, record);
    next();
  }
}