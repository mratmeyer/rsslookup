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
 * Checks whether a content-type header value indicates an RSS/Atom feed.
 */
export function isFeedContentType(contentType: string): boolean {
  return (
    contentType.includes("xml") ||
    contentType.includes("rss") ||
    contentType.includes("atom")
  );
}
