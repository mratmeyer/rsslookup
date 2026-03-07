import { getDomain } from "tldts";

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
