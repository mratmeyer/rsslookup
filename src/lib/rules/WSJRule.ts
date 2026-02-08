import { StaticFeedRule } from "./StaticFeedRule";

/**
 * All known Wall Street Journal RSS feeds.
 */
export const WSJ_FEEDS = [
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
] as const;

export const WSJRule = new StaticFeedRule(
  "WSJ",
  ["wsj.com", "www.wsj.com"],
  WSJ_FEEDS,
);
