import * as htmlparser2 from "htmlparser2";
import { FEED_MIME_TYPES } from "./constants";
import type { FeedsMap } from "./types";

/**
 * Fetches an RSS/Atom feed and extracts its title.
 * @param feedUrl - The URL of the feed to fetch.
 * @param userAgent - The user agent string to use for requests.
 * @returns The feed title or null if not found/error.
 */
export async function fetchFeedTitle(
  feedUrl: string,
  userAgent: string
): Promise<string | null> {
  try {
    const response = await fetch(feedUrl, {
      method: "GET",
      headers: { "User-Agent": userAgent },
      redirect: "follow",
    });

    if (!response.ok && response.status !== 304) {
      return null;
    }

    const text = await response.text();
    return parseFeedTitle(text);
  } catch {
    return null;
  }
}

/**
 * Parses RSS/Atom XML content to extract the feed title.
 * @param xmlContent - The XML content to parse.
 * @returns The feed title or null if not found.
 */
function parseFeedTitle(xmlContent: string): string | null {
  let title: string | null = null;
  let inChannel = false;
  let inFeed = false;
  let inItem = false;
  let inEntry = false;
  let inTitle = false;

  const parser = new htmlparser2.Parser(
    {
      onopentag(name) {
        const tagName = name.toLowerCase();
        if (tagName === "channel") {
          inChannel = true;
        } else if (tagName === "feed") {
          inFeed = true;
        } else if (tagName === "item") {
          inItem = true;
        } else if (tagName === "entry") {
          inEntry = true;
        } else if (
          tagName === "title" &&
          (inChannel || inFeed) &&
          !inItem &&
          !inEntry &&
          title === null
        ) {
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
        if (tagName === "title") {
          inTitle = false;
        } else if (tagName === "channel") {
          inChannel = false;
        } else if (tagName === "feed") {
          inFeed = false;
        } else if (tagName === "item") {
          inItem = false;
        } else if (tagName === "entry") {
          inEntry = false;
        }
      },
    },
    { xmlMode: true }
  );

  parser.write(xmlContent);
  parser.end();

  return title || null;
}

/**
 * Parses HTML content to find RSS/Atom feed links.
 * @param htmlContent - The HTML text to parse.
 * @param baseUrl - The base URL for resolving relative links.
 * @param feedsMap - Map of feed URL -> title (null if title should be fetched).
 */
export function parseHtmlForFeeds(
  htmlContent: string,
  baseUrl: string,
  feedsMap: FeedsMap
): void {
  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      if (
        name === "link" &&
        attributes.rel === "alternate" &&
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
