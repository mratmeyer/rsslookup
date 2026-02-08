import { StaticFeedRule } from "./StaticFeedRule";

/**
 * All known New York Post RSS feeds organized by category.
 */
export const NY_POST_FEEDS = [
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
] as const;

export const NYPostRule = new StaticFeedRule(
  "NY Post",
  ["nypost.com", "www.nypost.com"],
  NY_POST_FEEDS,
);
