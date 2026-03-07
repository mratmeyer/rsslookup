import * as htmlparser2 from "htmlparser2";
import { MAX_FEED_RESPONSE_BYTES } from "./constants";
import { isFeedContentType } from "./utils/feedContentType";
import { readResponseBody } from "./utils/readResponseBody";
import { safeFetch } from "./fetchFeed";
import type { FeedInfo } from "./types";

/**
 * Fetches an RSS/Atom feed and extracts its metadata.
 * @param feedUrl - The URL of the feed to fetch.
 * @param userAgent - The user agent string to use for requests.
 * @returns Feed info or null if not found/error.
 */
export async function fetchFeedInfo(
  feedUrl: string,
  userAgent: string,
): Promise<FeedInfo | null> {
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
    return parseFeedInfo(text);
  } catch {
    return null;
  }
}

/**
 * Parses RSS/Atom XML content to extract feed metadata.
 * @param xmlContent - The XML content to parse.
 * @returns Feed info with title, item count, last post date, and frequency.
 */
export function parseFeedInfo(xmlContent: string): FeedInfo {
  let title: string | null = null;
  let description: string | null = null;
  let inChannel = false;
  let inFeed = false;
  let inItem = false;
  let inEntry = false;
  let inTitle = false;
  let inDescription = false;
  let inDate = false;
  let itemCount = 0;
  const dates: Date[] = [];
  let currentDateText = "";

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
        } else if (
          (tagName === "description" || tagName === "subtitle") &&
          (inChannel || inFeed) &&
          !inItem &&
          !inEntry &&
          description === null
        ) {
          inDescription = true;
        } else if (
          (inItem || inEntry) &&
          (tagName === "pubdate" ||
            tagName === "published" ||
            tagName === "updated")
        ) {
          inDate = true;
          currentDateText = "";
        }
      },
      ontext(text) {
        if (inTitle) {
          title = text.trim();
        } else if (inDescription) {
          description = (description || "") + text;
        } else if (inDate) {
          currentDateText += text;
        }
      },
      onclosetag(name) {
        const tagName = name.toLowerCase();
        if (tagName === "title") {
          inTitle = false;
        } else if (tagName === "description" || tagName === "subtitle") {
          if (inDescription) {
            description = description?.trim() || null;
          }
          inDescription = false;
        } else if (tagName === "channel") {
          inChannel = false;
        } else if (tagName === "feed") {
          inFeed = false;
        } else if (tagName === "item") {
          inItem = false;
          itemCount++;
        } else if (tagName === "entry") {
          inEntry = false;
          itemCount++;
        } else if (
          tagName === "pubdate" ||
          tagName === "published" ||
          tagName === "updated"
        ) {
          if (inDate && currentDateText.trim()) {
            const parsed = new Date(currentDateText.trim());
            if (!isNaN(parsed.getTime())) {
              dates.push(parsed);
            }
          }
          inDate = false;
          currentDateText = "";
        }
      },
    },
    { xmlMode: true },
  );

  parser.write(xmlContent);
  parser.end();

  // lastPostDate: first item's date (feeds typically list newest first), fallback to max
  let lastPostDate: string | null = null;
  if (dates.length > 0) {
    const maxDate = dates.reduce((a, b) => (a > b ? a : b));
    lastPostDate = maxDate.toISOString();
  }

  return {
    title: title || null,
    description: description || null,
    itemCount,
    lastPostDate,
    postFrequency: calculateFrequency(dates),
  };
}

function calculateFrequency(dates: Date[]): string | null {
  if (dates.length < 2) return null;

  const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
  const totalMs = sorted[0].getTime() - sorted[sorted.length - 1].getTime();
  if (totalMs <= 0) return null;

  const intervals = sorted.length - 1;
  const avgMs = totalMs / intervals;

  const avgDays = avgMs / (1000 * 60 * 60 * 24);

  if (avgDays < 1.5) {
    const postsPerDay = Math.round(1 / avgDays);
    if (postsPerDay <= 1) return "~1 post/day";
    return `~${postsPerDay} posts/day`;
  } else if (avgDays < 10) {
    const postsPerWeek = Math.round(7 / avgDays);
    if (postsPerWeek <= 1) return "~1 post/week";
    return `~${postsPerWeek} posts/week`;
  } else {
    const postsPerMonth = Math.round(30 / avgDays);
    if (postsPerMonth <= 1) return "~1 post/month";
    return `~${postsPerMonth} posts/month`;
  }
}
