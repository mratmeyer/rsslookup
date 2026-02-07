import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * All known CBS News RSS feeds organized by category.
 */
const CBS_NEWS_FEEDS: ReadonlyArray<{ url: string; title: string }> = [
  // Topics
  {
    url: "https://www.cbsnews.com/latest/rss/main",
    title: "Top Stories",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/us",
    title: "U.S.",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/politics",
    title: "Politics",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/world",
    title: "World",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/health",
    title: "Health",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/moneywatch",
    title: "MoneyWatch",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/science",
    title: "Science",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/technology",
    title: "Technology",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/entertainment",
    title: "Entertainment",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/space",
    title: "Space",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/evening-news/cbs-news-investigates",
    title: "CBS News Investigations",
  },
  // CBS News Broadcasts
  {
    url: "https://www.cbsnews.com/latest/rss/cbs-mornings-clips",
    title: "CBS Mornings",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/evening-news",
    title: "CBS Evening News",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/evening-news-on-the-road",
    title: "On the Road",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/60-minutes",
    title: "60 Minutes",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/sunday-morning",
    title: "Sunday Morning",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/face-the-nation",
    title: "Face the Nation",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/48-hours",
    title: "48 Hours",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/cbs-mornings-saturday-clips",
    title: "CBS Saturday Morning",
  },
  // CBS News Streaming Network
  {
    url: "https://www.cbsnews.com/latest/rss/cbs-reports-custom",
    title: "CBS Reports",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/cbs-news-mornings-clips",
    title: "CBS Morning News",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/daily-report-clips",
    title: "The Daily Report",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/the-takeout-full-episodes",
    title: "The Takeout",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/uplift-full-episodes",
    title: "The Uplift",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/eye-on-america-full-episodes",
    title: "Eye on America",
  },
  {
    url: "https://www.cbsnews.com/latest/rss/the-dish-full-episodes",
    title: "The Dish",
  },
];

/**
 * Rule for discovering RSS feeds on CBS News.
 * Handles cbsnews.com and www.cbsnews.com URLs by returning all known CBS News feeds.
 */
export class CBSNewsRule implements SiteRule {
  readonly name = "CBS News";

  matchesHostname(hostname: string): boolean {
    return hostname === "cbsnews.com" || hostname === "www.cbsnews.com";
  }

  extractFeeds(_context: RuleContext, feedsMap: FeedsMap): void {
    for (const feed of CBS_NEWS_FEEDS) {
      feedsMap.set(feed.url, { title: feed.title, isFromRule: true });
    }
  }
}
