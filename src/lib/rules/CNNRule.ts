import { StaticFeedRule } from "./StaticFeedRule";

/**
 * All known CNN RSS feeds.
 */
export const CNN_FEEDS = [
  {
    url: "http://rss.cnn.com/rss/cnn_topstories.rss",
    title: "Top Stories",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_world.rss",
    title: "World",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_us.rss",
    title: "U.S.",
  },
  {
    url: "http://rss.cnn.com/rss/money_latest.rss",
    title: "Business",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_allpolitics.rss",
    title: "Politics",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_tech.rss",
    title: "Technology",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_health.rss",
    title: "Health",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_showbiz.rss",
    title: "Entertainment",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_travel.rss",
    title: "Travel",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_freevideo.rss",
    title: "Video",
  },
  {
    url: "http://rss.cnn.com/services/podcasting/cnn10/rss.xml",
    title: "CNN 10",
  },
  {
    url: "http://rss.cnn.com/rss/cnn_latest.rss",
    title: "Most Recent",
  },
  {
    url: "http://rss.cnn.com/cnn-underscored.rss",
    title: "CNN Underscored",
  },
] as const;

export const CNNRule = new StaticFeedRule(
  "CNN",
  ["cnn.com", "www.cnn.com"],
  CNN_FEEDS,
);
