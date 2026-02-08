import { StaticFeedRule } from "./StaticFeedRule";

/**
 * All known Fox News RSS feeds.
 */
export const FOX_NEWS_FEEDS = [
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
] as const;

export const FoxNewsRule = new StaticFeedRule(
  "Fox News",
  ["foxnews.com", "www.foxnews.com"],
  FOX_NEWS_FEEDS,
);
