import * as htmlparser2 from "htmlparser2";
import { MAX_FEED_RESPONSE_BYTES } from "./constants";
import { isFeedContentType } from "./utils/feedContentType";
import { readResponseBody } from "./utils/readResponseBody";
import { safeFetch } from "./fetchFeed";
import type { FeedInfo, FeedPostPreview } from "./types";

const MAX_PREVIEW_POSTS = 10;
const MAX_SUMMARY_LENGTH = 240;

type CurrentPost = {
  title: string;
  url: string | null;
  hasAlternateUrl: boolean;
  publishedAt: string | null;
  summary: string;
};

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
  let currentPost: CurrentPost | null = null;
  let currentPostField: "title" | "link" | "summary" | "date" | null = null;
  let itemCount = 0;
  const posts: FeedPostPreview[] = [];
  const dates: Date[] = [];
  let currentDateText = "";

  const parser = new htmlparser2.Parser(
    {
      onopentag(name, attribs) {
        const tagName = name.toLowerCase();
        if (tagName === "channel") {
          inChannel = true;
        } else if (tagName === "feed") {
          inFeed = true;
        } else if (tagName === "item") {
          inItem = true;
          currentPost = createCurrentPost();
        } else if (tagName === "entry") {
          inEntry = true;
          currentPost = createCurrentPost();
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
        } else if ((inItem || inEntry) && tagName === "title") {
          currentPostField = "title";
        } else if ((inItem || inEntry) && tagName === "link") {
          if (inEntry && attribs.href && currentPost) {
            const rel = attribs.rel?.toLowerCase();
            if (rel === "alternate" || (!rel && !currentPost.url)) {
              currentPost.url = attribs.href;
              currentPost.hasAlternateUrl = true;
            } else if (!currentPost.url && !currentPost.hasAlternateUrl) {
              currentPost.url = attribs.href;
            }
          } else if (inItem) {
            currentPostField = "link";
          }
        } else if (
          (inItem || inEntry) &&
          (tagName === "description" ||
            tagName === "summary" ||
            tagName === "content") &&
          currentPost?.summary === ""
        ) {
          currentPostField = "summary";
        } else if (
          (inItem || inEntry) &&
          (tagName === "pubdate" ||
            tagName === "published" ||
            tagName === "updated")
        ) {
          inDate = true;
          currentPostField = "date";
          currentDateText = "";
        }
      },
      ontext(text) {
        if (inTitle) {
          title = text.trim();
        } else if (inDescription) {
          description = (description || "") + text;
        }

        if (currentPost && currentPostField === "title") {
          currentPost.title += text;
        } else if (currentPost && currentPostField === "link") {
          currentPost.url = `${currentPost.url || ""}${text}`;
        } else if (currentPost && currentPostField === "summary") {
          currentPost.summary += text;
        }

        if (inDate) {
          currentDateText += text;
        }
      },
      onclosetag(name) {
        const tagName = name.toLowerCase();
        if (tagName === "title") {
          inTitle = false;
          if (currentPostField === "title") {
            currentPostField = null;
          }
        } else if (tagName === "description" || tagName === "subtitle") {
          if (inDescription) {
            description = description?.trim() || null;
          }
          inDescription = false;
          if (currentPostField === "summary") {
            currentPostField = null;
          }
        } else if (
          (tagName === "link" && currentPostField === "link") ||
          ((tagName === "summary" || tagName === "content") &&
            currentPostField === "summary")
        ) {
          currentPostField = null;
        } else if (tagName === "channel") {
          inChannel = false;
        } else if (tagName === "feed") {
          inFeed = false;
        } else if (tagName === "item") {
          addPreviewPost(posts, currentPost);
          currentPost = null;
          currentPostField = null;
          inItem = false;
          itemCount++;
        } else if (tagName === "entry") {
          addPreviewPost(posts, currentPost);
          currentPost = null;
          currentPostField = null;
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
              if (currentPost) {
                currentPost.publishedAt = parsed.toISOString();
              }
            }
          }
          inDate = false;
          if (currentPostField === "date") {
            currentPostField = null;
          }
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
    posts,
  };
}

function createCurrentPost(): CurrentPost {
  return {
    title: "",
    url: null,
    hasAlternateUrl: false,
    publishedAt: null,
    summary: "",
  };
}

function addPreviewPost(
  posts: FeedPostPreview[],
  post: CurrentPost | null,
): void {
  if (!post || posts.length >= MAX_PREVIEW_POSTS) return;

  const title = cleanText(post.title);
  const url = cleanText(post.url || "");
  const summary = truncateSummary(cleanText(post.summary));

  posts.push({
    title: title || null,
    url: url || null,
    publishedAt: post.publishedAt,
    ...(summary && { summary }),
  });
}

function cleanText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateSummary(summary: string): string {
  if (summary.length <= MAX_SUMMARY_LENGTH) return summary;
  return `${summary.slice(0, MAX_SUMMARY_LENGTH - 3).trimEnd()}...`;
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
