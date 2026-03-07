import * as htmlparser2 from "htmlparser2";
import { MAX_FEED_RESPONSE_BYTES } from "./constants";
import { isFeedContentType } from "./utils/feedContentType";
import { readResponseBody } from "./utils/readResponseBody";
import { safeFetch } from "./fetchFeed";

/**
 * Fetches an RSS/Atom feed and extracts its title.
 * @param feedUrl - The URL of the feed to fetch.
 * @param userAgent - The user agent string to use for requests.
 * @returns The feed title or null if not found/error.
 */
export async function fetchFeedTitle(
  feedUrl: string,
  userAgent: string,
): Promise<string | null> {
  try {
    const result = await safeFetch(feedUrl, userAgent);
    if (!result) return null;

    const contentType = result.response.headers.get("content-type") || "";
    if (!isFeedContentType(contentType)) {
      return null;
    }

    const text = await readResponseBody(
      result.response,
      MAX_FEED_RESPONSE_BYTES,
    );
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
    { xmlMode: true },
  );

  parser.write(xmlContent);
  parser.end();

  return title || null;
}
