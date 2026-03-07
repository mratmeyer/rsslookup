/**
 * Centralized constants for RSS Lookup.
 * Keeping magic strings and configuration values in one place for easier maintenance.
 */

/**
 * User agent string for HTTP requests made by the server.
 */
export const USER_AGENT =
  "RSSLookup/1.0.1 (https://github.com/mratmeyer/rsslookup)";

/**
 * Timeout in milliseconds for outbound HTTP requests.
 */
export const FETCH_TIMEOUT_MS = 10_000;

/**
 * Maximum response body size in bytes for the main page HTML fetch.
 */
export const MAX_HTML_RESPONSE_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Maximum response body size in bytes for feed XML fetches (metadata extraction).
 */
export const MAX_FEED_RESPONSE_BYTES = 1024 * 1024; // 1 MB

/**
 * Common feed paths to check when no feed is found in HTML.
 * Includes both absolute paths (starting with /) and relative paths.
 */
export const POSSIBLE_FEED_PATHS = [
  // Absolute paths
  "/atom",
  "/atom.xml",
  "/feed",
  "/feed/",
  "/feed.rss",
  "/feed.xml",
  "/index.rss",
  "/index.xml",
  "/rss",
  "/rss/",
  "/rss.xml",

  // Relative paths
  "atom",
  "atom.xml",
  "feed",
  "feed/",
  "feed.rss",
  "feed.xml",
  "index.rss",
  "index.xml",
  "rss",
  "rss/",
  "rss.xml",
] as const;
