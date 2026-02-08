import { StaticFeedRule } from "./StaticFeedRule";

/**
 * All known CBS News RSS feeds organized by category.
 */
export const CBS_NEWS_FEEDS = [
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
] as const;

export const CBSNewsRule = new StaticFeedRule(
  "CBS News",
  ["cbsnews.com", "www.cbsnews.com"],
  CBS_NEWS_FEEDS,
);
