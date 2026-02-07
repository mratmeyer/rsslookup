import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * All known Wall Street Journal RSS feeds.
 */
const WSJ_FEEDS: ReadonlyArray<{ url: string; title: string }> = [
  // News & Commentary
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSOpinion",
    title: "Opinion",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSWorldNews",
    title: "World News",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/WSJcomUSBusiness",
    title: "U.S. Business",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSMarketsMain",
    title: "Markets News",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSWSJD",
    title: "Technology: What's News",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSLifestyle",
    title: "Lifestyle",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSUSnews",
    title: "U.S.",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/socialpoliticsfeed",
    title: "Politics",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/socialeconomyfeed",
    title: "Economy",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSArtsCulture",
    title: "Arts",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/latestnewsrealestate",
    title: "Real Estate",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSPersonalFinance",
    title: "Personal Finance",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/socialhealth",
    title: "Health",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/RSSStyle",
    title: "Style",
  },
  {
    url: "https://feeds.content.dowjones.io/public/rss/rsssportsfeed",
    title: "Sports",
  },
];

/**
 * Rule for discovering RSS feeds on The Wall Street Journal.
 * Handles wsj.com and www.wsj.com URLs by returning all known WSJ feeds.
 */
export class WSJRule implements SiteRule {
  readonly name = "WSJ";

  matchesHostname(hostname: string): boolean {
    return hostname === "wsj.com" || hostname === "www.wsj.com";
  }

  extractFeeds(_context: RuleContext, feedsMap: FeedsMap): void {
    for (const feed of WSJ_FEEDS) {
      feedsMap.set(feed.url, { title: feed.title, isFromRule: true });
    }
  }
}
