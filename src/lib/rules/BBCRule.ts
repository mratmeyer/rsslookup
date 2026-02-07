import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * All known BBC News RSS feeds organized by category.
 */
const BBC_FEEDS: ReadonlyArray<{ url: string; title: string }> = [
  // Popular BBC News Feeds
  {
    url: "http://feeds.bbci.co.uk/news/rss.xml",
    title: "Top Stories",
  },
  {
    url: "http://feeds.bbci.co.uk/news/world/rss.xml",
    title: "World",
  },
  {
    url: "http://feeds.bbci.co.uk/news/uk/rss.xml",
    title: "UK",
  },
  {
    url: "http://feeds.bbci.co.uk/news/business/rss.xml",
    title: "Business",
  },
  {
    url: "http://feeds.bbci.co.uk/news/politics/rss.xml",
    title: "Politics",
  },
  {
    url: "http://feeds.bbci.co.uk/news/health/rss.xml",
    title: "Health",
  },
  {
    url: "http://feeds.bbci.co.uk/news/education/rss.xml",
    title: "Education & Family",
  },
  {
    url: "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
    title: "Science & Environment",
  },
  {
    url: "http://feeds.bbci.co.uk/news/technology/rss.xml",
    title: "Technology",
  },
  {
    url: "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
    title: "Entertainment & Arts",
  },
  // Global and UK News Feeds
  {
    url: "http://feeds.bbci.co.uk/news/world/africa/rss.xml",
    title: "Africa",
  },
  {
    url: "http://feeds.bbci.co.uk/news/world/asia/rss.xml",
    title: "Asia",
  },
  {
    url: "http://feeds.bbci.co.uk/news/world/europe/rss.xml",
    title: "Europe",
  },
  {
    url: "http://feeds.bbci.co.uk/news/world/latin_america/rss.xml",
    title: "Latin America",
  },
  {
    url: "http://feeds.bbci.co.uk/news/world/middle_east/rss.xml",
    title: "Middle East",
  },
  {
    url: "http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
    title: "US & Canada",
  },
  {
    url: "http://feeds.bbci.co.uk/news/england/rss.xml",
    title: "England",
  },
  {
    url: "http://feeds.bbci.co.uk/news/northern_ireland/rss.xml",
    title: "Northern Ireland",
  },
  {
    url: "http://feeds.bbci.co.uk/news/scotland/rss.xml",
    title: "Scotland",
  },
  {
    url: "http://feeds.bbci.co.uk/news/wales/rss.xml",
    title: "Wales",
  },
  // Video & Audio News Feeds
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml?edition=uk",
    title: "Top Stories (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
    title: "World (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/uk/rss.xml",
    title: "UK (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/business/rss.xml",
    title: "Business (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/politics/rss.xml",
    title: "Politics (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/health/rss.xml",
    title: "Health (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/science_and_environment/rss.xml",
    title: "Science & Environment (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/technology/rss.xml",
    title: "Technology (Video & Audio)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/video_and_audio/entertainment_and_arts/rss.xml",
    title: "Entertainment & Arts (Video & Audio)",
  },
  // Other News Feeds
  {
    url: "http://feeds.bbci.co.uk/news/system/latest_published_content/rss.xml",
    title: "Latest Published Stories",
  },
  {
    url: "http://feeds.bbci.co.uk/news/magazine/rss.xml",
    title: "Magazine",
  },
  {
    url: "http://feeds.bbci.co.uk/news/also_in_the_news/rss.xml",
    title: "Also in the News",
  },
  {
    url: "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/in_pictures/rss.xml",
    title: "In Pictures",
  },
  {
    url: "http://feeds.bbci.co.uk/news/special_reports/rss.xml",
    title: "Special Reports",
  },
  {
    url: "http://feeds.bbci.co.uk/news/have_your_say/rss.xml",
    title: "Have Your Say",
  },
  {
    url: "https://www.bbc.co.uk/blogs/theeditors/rss.xml",
    title: "Editors Blog",
  },
  // Top Stories Regional Editions
  {
    url: "http://feeds.bbci.co.uk/news/rss.xml?edition=uk",
    title: "Top Stories (UK Edition)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/rss.xml?edition=us",
    title: "Top Stories (US & Canada Edition)",
  },
  {
    url: "http://feeds.bbci.co.uk/news/rss.xml?edition=int",
    title: "Top Stories (International Edition)",
  },
];

/**
 * Rule for discovering RSS feeds on the BBC.
 * Handles bbc.co.uk, bbc.com, and their www subdomains by returning all known BBC feeds.
 */
export class BBCRule implements SiteRule {
  readonly name = "BBC";

  matchesHostname(hostname: string): boolean {
    return (
      hostname === "bbc.co.uk" ||
      hostname === "www.bbc.co.uk" ||
      hostname === "bbc.com" ||
      hostname === "www.bbc.com"
    );
  }

  extractFeeds(_context: RuleContext, feedsMap: FeedsMap): void {
    for (const feed of BBC_FEEDS) {
      feedsMap.set(feed.url, { title: feed.title, isFromRule: true });
    }
  }
}
