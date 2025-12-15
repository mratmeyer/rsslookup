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
 * Valid MIME types for RSS/Atom feeds.
 * Includes HTML entity-encoded variants (&#re; = +) seen in some malformed pages
 * where the '+' character was incorrectly encoded as an HTML entity.
 */
export const FEED_MIME_TYPES = new Set([
  "application/rss+xml",
  "application/atom+xml",
  "application/rss&#re;xml", // Malformed: some sites encode '+' as HTML entity
  "application/atom&#re;xml", // Malformed: some sites encode '+' as HTML entity
]);

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
