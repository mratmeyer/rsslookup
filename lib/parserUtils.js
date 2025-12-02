import * as htmlparser2 from 'htmlparser2';
import { FEED_MIME_TYPES } from './constants.js';

/**
 * Fetches an RSS/Atom feed and extracts its title.
 * @param {string} feedUrl - The URL of the feed to fetch.
 * @param {string} userAgent - The user agent string to use for requests.
 * @returns {Promise<string|null>} The feed title or null if not found/error.
 */
export async function fetchFeedTitle(feedUrl, userAgent) {
  try {
    const response = await fetch(feedUrl, {
      method: 'GET',
      headers: { 'User-Agent': userAgent },
      redirect: 'follow',
    });

    if (!response.ok && response.status !== 304) {
      return null;
    }

    const text = await response.text();
    return parseFeedTitle(text);
  } catch (error) {
    return null;
  }
}

/**
 * Parses RSS/Atom XML content to extract the feed title.
 * @param {string} xmlContent - The XML content to parse.
 * @returns {string|null} The feed title or null if not found.
 */
function parseFeedTitle(xmlContent) {
  let title = null;
  let inChannel = false;
  let inFeed = false;
  let inItem = false;
  let inEntry = false;
  let inTitle = false;

  const parser = new htmlparser2.Parser({
    onopentag(name) {
      const tagName = name.toLowerCase();
      if (tagName === 'channel') {
        inChannel = true;
      } else if (tagName === 'feed') {
        inFeed = true;
      } else if (tagName === 'item') {
        inItem = true;
      } else if (tagName === 'entry') {
        inEntry = true;
      } else if (tagName === 'title' && (inChannel || inFeed) && !inItem && !inEntry && title === null) {
        inTitle = true;
      }
    },
    ontext(text) {
      if (inTitle) {
        title = text.trim();
      }
    },
    onclosetag(name) {
      const tagName = name.toLowerCase();
      if (tagName === 'title') {
        inTitle = false;
      } else if (tagName === 'channel') {
        inChannel = false;
      } else if (tagName === 'feed') {
        inFeed = false;
      } else if (tagName === 'item') {
        inItem = false;
      } else if (tagName === 'entry') {
        inEntry = false;
      }
    },
  }, { xmlMode: true });

  parser.write(xmlContent);
  parser.end();

  return title || null;
}

/**
 * Parses HTML content to find RSS/Atom feed links.
 * @param {string} htmlContent - The HTML text to parse.
 * @param {string} baseUrl - The base URL for resolving relative links.
 * @param {Map<string, string|null>} feedsMap - Map of feed URL -> title (null if title should be fetched).
 */
export function parseHtmlForFeeds(htmlContent, baseUrl, feedsMap) {
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
            if (!feedsMap.has(feedUrl)) {
              feedsMap.set(feedUrl, null); // null = fetch title later
            }
          } catch {
            // Silently ignore invalid URLs - malformed href attributes should not break parsing
          }
        }
      }
    },
  });
  parser.write(htmlContent);
  parser.end();
}

