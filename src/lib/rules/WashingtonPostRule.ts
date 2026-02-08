import { StaticFeedRule } from "./StaticFeedRule";

/**
 * All known Washington Post RSS feeds organized by category.
 */
export const WAPO_FEEDS = [
  // Main Sections
  {
    url: "https://www.washingtonpost.com/arcio/rss/category/politics/",
    title: "Politics",
  },
  {
    url: "https://www.washingtonpost.com/arcio/rss/category/opinions/",
    title: "Opinions",
  },
  {
    url: "https://feeds.washingtonpost.com/rss/local",
    title: "Local",
  },
  {
    url: "https://www.washingtonpost.com/arcio/rss/category/sports/",
    title: "Sports",
  },
  {
    url: "https://feeds.washingtonpost.com/rss/business/technology",
    title: "Technology",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/national",
    title: "National",
  },
  {
    url: "https://feeds.washingtonpost.com/rss/world",
    title: "World",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/business",
    title: "Business",
  },
  {
    url: "https://feeds.washingtonpost.com/rss/lifestyle",
    title: "Lifestyle",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/entertainment",
    title: "Entertainment",
  },
  // Politics Sub-feeds
  {
    url: "http://feeds.washingtonpost.com/rss/rss_the-fix",
    title: "The Fix",
  },
  // Opinions Sub-feeds
  {
    url: "https://www.washingtonpost.com/arcio/rss/author/George%20F%20-Will/",
    title: "George F. Will",
  },
  // Local Sub-feeds
  {
    url: "http://feeds.washingtonpost.com/rss/rss_capital-weather-gang",
    title: "Capital Weather Gang",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/national/inspired-life",
    title: "The Optimist",
  },
  {
    url: "https://www.washingtonpost.com/arcio/rss/category/history/",
    title: "Retropolis",
  },
  // Sports Sub-feeds
  {
    url: "http://feeds.washingtonpost.com/rss/rss_recruiting-insider",
    title: "High School Sports",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/rss_dc-sports-bog",
    title: "DC Sports Bog",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/rss_terrapins-insider",
    title: "Maryland Terrapins",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/rss_soccer-insider",
    title: "Soccer",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/rss_football-insider",
    title: "Washington Commanders",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/rss_capitals-insider",
    title: "Washington Capitals",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/rss_nationals-journal",
    title: "Washington Nationals",
  },
  {
    url: "http://feeds.washingtonpost.com/rss/rss_wizards-insider",
    title: "Washington Wizards",
  },
  // Entertainment Sub-feeds
  {
    url: "http://feeds.washingtonpost.com/rss/rss_going-out-gurus",
    title: "Going Out Guide",
  },
] as const;

export const WashingtonPostRule = new StaticFeedRule(
  "Washington Post",
  ["washingtonpost.com", "www.washingtonpost.com"],
  WAPO_FEEDS,
);
