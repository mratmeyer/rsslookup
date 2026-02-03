import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getDomain } from "tldts";
import type { CloudflareEnv } from "./types";
import { trackEvent } from "./analytics";

/**
 * High-traffic domains that get 5x the normal rate limit.
 * These are popular sites that users frequently look up.
 */
export const HIGH_TRAFFIC_DOMAINS = new Set([
  // Video platforms
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "vimeo.com",
  "www.vimeo.com",
  "twitch.tv",
  "www.twitch.tv",

  // Social media
  "reddit.com",
  "www.reddit.com",
  "old.reddit.com",
  "twitter.com",
  "www.twitter.com",
  "x.com",
  "www.x.com",

  // Code hosting
  "github.com",
  "www.github.com",
  "gitlab.com",
  "www.gitlab.com",

  // News aggregators
  "news.ycombinator.com",

  // Q&A sites
  "stackoverflow.com",
  "www.stackoverflow.com",
  "stackexchange.com",
  "www.stackexchange.com",

  // Podcasts
  "podcasts.apple.com",
  "open.spotify.com",
]);

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  ip: {
    requests: 10,
    window: "5 m", // 5 minutes
  },
  domain: {
    requests: 50,
    window: "1 h", // 1 hour
  },
  domainHighTraffic: {
    requests: 250, // 5x multiplier
    window: "1 h", // 1 hour
  },
} as const;

/**
 * Error messages for rate limiting
 */
export const RATE_LIMIT_MESSAGES = {
  ip: "You've hit the rate limit. Please try again later.",
  domain: (domain: string) =>
    `The domain ${domain} has been queried too many times recently. ` +
    `Rate limiting helps prevent abuse and keeps the service free for everyone. ` +
    `Please wait an hour and try again, or if you believe this is an error, ` +
    `open an issue at https://github.com/mratmeyer/rsslookup/issues with the domain name.`,
} as const;

/**
 * Combined rate limit check result
 */
export interface RateLimitResult {
  allowed: boolean;
  errorMessage?: string;
  errorType?: "ip" | "domain";
}

// Cached rate limiter instances
let ipRateLimiter: Ratelimit | null = null;
let domainRateLimiter: Ratelimit | null = null;
let domainHighTrafficRateLimiter: Ratelimit | null = null;
let redisClient: Redis | null = null;

/**
 * Initialize or get the Redis client
 */
function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

/**
 * Get the IP rate limiter instance
 */
function getIpRateLimiter(): Ratelimit | null {
  if (ipRateLimiter) return ipRateLimiter;

  const redis = getRedisClient();
  if (!redis) return null;

  ipRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.ip.requests,
      RATE_LIMITS.ip.window
    ),
    prefix: "ratelimit:ip:",
    analytics: false,
  });

  return ipRateLimiter;
}

/**
 * Get the domain rate limiter instance (standard)
 */
function getDomainRateLimiter(): Ratelimit | null {
  if (domainRateLimiter) return domainRateLimiter;

  const redis = getRedisClient();
  if (!redis) return null;

  domainRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.domain.requests,
      RATE_LIMITS.domain.window
    ),
    prefix: "ratelimit:domain:",
    analytics: false,
  });

  return domainRateLimiter;
}

/**
 * Get the domain rate limiter instance (high traffic)
 */
function getDomainHighTrafficRateLimiter(): Ratelimit | null {
  if (domainHighTrafficRateLimiter) return domainHighTrafficRateLimiter;

  const redis = getRedisClient();
  if (!redis) return null;

  domainHighTrafficRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
      RATE_LIMITS.domainHighTraffic.requests,
      RATE_LIMITS.domainHighTraffic.window
    ),
    prefix: "ratelimit:domain-ht:",
    analytics: false,
  });

  return domainHighTrafficRateLimiter;
}

/**
 * Extract the registrable domain from a hostname for rate limiting purposes.
 * Uses tldts to properly handle all TLDs including multi-part ones.
 * e.g., "blog.shop.example.com" -> "example.com"
 * e.g., "www.example.co.uk" -> "example.co.uk"
 */
export function extractRootDomain(hostname: string): string {
  const domain = getDomain(hostname);
  return domain || hostname.toLowerCase();
}

/**
 * Check if a domain is in the high-traffic list
 */
export function isHighTrafficDomain(hostname: string): boolean {
  const lowerHostname = hostname.toLowerCase();
  const rootDomain = extractRootDomain(hostname);

  return (
    HIGH_TRAFFIC_DOMAINS.has(lowerHostname) ||
    HIGH_TRAFFIC_DOMAINS.has(rootDomain)
  );
}

/**
 * Check rate limit for a specific IP address
 */
async function checkIpRateLimit(ip: string): Promise<boolean> {
  const limiter = getIpRateLimiter();
  if (!limiter) return true; // Rate limiting disabled

  const result = await limiter.limit(ip);
  return result.success;
}

/**
 * Check rate limit for a specific domain
 */
async function checkDomainRateLimit(domain: string): Promise<boolean> {
  const rootDomain = extractRootDomain(domain);
  const isHighTraffic = isHighTrafficDomain(domain);

  const limiter = isHighTraffic
    ? getDomainHighTrafficRateLimiter()
    : getDomainRateLimiter();

  if (!limiter) return true; // Rate limiting disabled

  const result = await limiter.limit(rootDomain);
  return result.success;
}

/**
 * Check both IP and domain rate limits.
 * Returns early if IP limit is exceeded.
 */
export async function checkRateLimits(
  ip: string | null,
  targetUrl: string,
  env?: CloudflareEnv,
  source: string = "unknown",
  ctx?: ExecutionContext
): Promise<RateLimitResult> {
  // Parse target URL to get domain
  let targetDomain: string;
  try {
    const url = new URL(targetUrl);
    targetDomain = url.hostname;
  } catch {
    // If URL is invalid, skip domain rate limiting (URL validation will catch this later)
    targetDomain = "";
  }

  // Helper for tracking rate limit events
  const trackRateLimit = (type: "ip" | "domain", limitType: string) => {
    if (env) {
      trackEvent(env, {
        eventName: "rate_limit",
        status: "blocked",
        method: "none",
        errorType: limitType,
        source,
        feedCount: 0,
        durationMs: 0,
        upstreamStatus: 429,
        externalRequestCount: 0,
      }, ctx);
    }
  };

  // Check IP rate limit first (if IP is available)
  if (ip) {
    const ipAllowed = await checkIpRateLimit(ip);
    if (!ipAllowed) {
      trackRateLimit("ip", "ip_limit_exceeded");
      return {
        allowed: false,
        errorMessage: RATE_LIMIT_MESSAGES.ip,
        errorType: "ip",
      };
    }
  }

  // Check domain rate limit (if we have a valid domain)
  if (targetDomain) {
    const domainAllowed = await checkDomainRateLimit(targetDomain);
    if (!domainAllowed) {
      trackRateLimit("domain", "domain_limit_exceeded");
      return {
        allowed: false,
        errorMessage: RATE_LIMIT_MESSAGES.domain(targetDomain),
        errorType: "domain",
      };
    }
  }

  return { allowed: true };
}
