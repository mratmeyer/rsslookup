import * as htmlparser2 from "htmlparser2";
import { FEED_MIME_TYPES } from "./utils/feedContentType";
import type { FeedsMap } from "./types";

/**
 * Parses HTML content to find RSS/Atom feed links.
 * @param htmlContent - The HTML text to parse.
 * @param baseUrl - The base URL for resolving relative links.
 * @param feedsMap - Map of feed URL -> title (null if title should be fetched).
 * @returns True if at least one new feed was found.
 */
export function parseHtmlForFeeds(
  htmlContent: string,
  baseUrl: string,
  feedsMap: FeedsMap,
): boolean {
  let foundAny = false;
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
              feedsMap.set(feedUrl, { title: null, isFromRule: false });
              foundAny = true;
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
  return foundAny;
}
