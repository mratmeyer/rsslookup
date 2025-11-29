import * as htmlparser2 from 'htmlparser2';

// Attributes to accept as RSS feeds
const FEED_MIME_TYPES = new Set([
  'application/rss+xml',
  'application/atom+xml',
  'application/rss&#re;xml', // Possible edge case
  'application/atom&#re;xml', // Possible edge case
]);

/**
 * Parses HTML content to find RSS/Atom feed links.
 * @param {string} htmlContent - The HTML text to parse.
 * @param {string} baseUrl - The base URL for resolving relative links.
 * @param {Set<string>} feedsSet - The Set to add found feed URLs to.
 */
export function parseHtmlForFeeds(htmlContent, baseUrl, feedsSet) {
  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      if (
        name === 'link' &&
        attributes.rel === 'alternate' &&
        attributes.href
      ) {
        if (
          attributes.type &&
          FEED_MIME_TYPES.has(attributes.type.toLowerCase())
        ) {
          try {
            const feedUrl = new URL(attributes.href, baseUrl).toString();
            feedsSet.add(feedUrl);
          } catch (e) {}
        }
      }
    },
  });
  parser.write(htmlContent);
  parser.end();
}

