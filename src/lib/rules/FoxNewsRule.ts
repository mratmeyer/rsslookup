import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * All known Fox News RSS feeds.
 */
const FOX_NEWS_FEEDS: ReadonlyArray<{ url: string; title: string }> = [
  {
    url: "https://moxie.foxnews.com/google-publisher/latest.xml",
    title: "Latest Headlines",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/world.xml",
    title: "World",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/us.xml",
    title: "U.S.",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/politics.xml",
    title: "Politics",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/science.xml",
    title: "Science",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/health.xml",
    title: "Health",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/sports.xml",
    title: "Sports",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/travel.xml",
    title: "Travel",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/tech.xml",
    title: "Tech",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/opinion.xml",
    title: "Opinion",
  },
  {
    url: "https://moxie.foxnews.com/google-publisher/videos.xml",
    title: "Video",
  },
];

/**
 * Rule for discovering RSS feeds on Fox News.
 * Handles foxnews.com and www.foxnews.com URLs by returning all known Fox News feeds.
 */
export class FoxNewsRule implements SiteRule {
  readonly name = "Fox News";

  matchesHostname(hostname: string): boolean {
    return hostname === "foxnews.com" || hostname === "www.foxnews.com";
  }

  extractFeeds(_context: RuleContext, feedsMap: FeedsMap): void {
    for (const feed of FOX_NEWS_FEEDS) {
      feedsMap.set(feed.url, { title: feed.title, isFromRule: true });
    }
  }
}
