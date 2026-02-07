import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * All known New York Post RSS feeds organized by category.
 */
const NY_POST_FEEDS: ReadonlyArray<{ url: string; title: string }> = [
  // Full Feeds
  {
    url: "https://nypost.com/feed/",
    title: "NYPost.com – All Stories",
  },
  {
    url: "https://pagesix.com/feed/",
    title: "PageSix.com – All Stories",
  },
  // Feeds by Section
  {
    url: "https://nypost.com/us-news/feed/",
    title: "US News",
  },
  {
    url: "https://nypost.com/metro/feed/",
    title: "Metro",
  },
  {
    url: "https://nypost.com/politics/feed/",
    title: "Politics",
  },
  {
    url: "https://nypost.com/world-news/feed/",
    title: "World News",
  },
  {
    url: "https://nypost.com/sports/feed/",
    title: "Sports",
  },
  {
    url: "https://nypost.com/business/feed/",
    title: "Business",
  },
  {
    url: "https://nypost.com/opinion/feed/",
    title: "Opinion",
  },
  {
    url: "https://nypost.com/entertainment/feed/",
    title: "Entertainment",
  },
  {
    url: "https://nypost.com/fashion-and-beauty/feed/",
    title: "Fashion and Beauty",
  },
  {
    url: "https://nypost.com/lifestyle/feed/",
    title: "Lifestyle",
  },
  {
    url: "https://nypost.com/tech/feed/",
    title: "Tech",
  },
  {
    url: "https://nypost.com/media/feed/",
    title: "Media",
  },
  {
    url: "https://nypost.com/real-estate/feed/",
    title: "Real Estate",
  },
];

/**
 * Rule for discovering RSS feeds on the New York Post.
 * Handles nypost.com and www.nypost.com URLs by returning all known NY Post feeds.
 */
export class NYPostRule implements SiteRule {
  readonly name = "NY Post";

  matchesHostname(hostname: string): boolean {
    return hostname === "nypost.com" || hostname === "www.nypost.com";
  }

  extractFeeds(_context: RuleContext, feedsMap: FeedsMap): void {
    for (const feed of NY_POST_FEEDS) {
      feedsMap.set(feed.url, { title: feed.title, isFromRule: true });
    }
  }
}
