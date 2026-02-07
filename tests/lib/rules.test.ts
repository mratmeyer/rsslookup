import { describe, it, expect, beforeEach } from "vitest";
import type { FeedsMap } from "~/lib/types";
import { applyRules, getRegisteredRules } from "~/lib/rules/index";
import { RedditRule } from "~/lib/rules/RedditRule";
import { YouTubeRule } from "~/lib/rules/YouTubeRule";
import { GitHubRule } from "~/lib/rules/GitHubRule";
import { StackExchangeRule } from "~/lib/rules/StackExchangeRule";
import { SteamRule } from "~/lib/rules/SteamRule";
import { NYTimesRule } from "~/lib/rules/NYTimesRule";
import { CNNRule } from "~/lib/rules/CNNRule";
import { FoxNewsRule } from "~/lib/rules/FoxNewsRule";
import { BBCRule } from "~/lib/rules/BBCRule";
import { NYPostRule } from "~/lib/rules/NYPostRule";
import { CNBCRule } from "~/lib/rules/CNBCRule";
import { CBSNewsRule } from "~/lib/rules/CBSNewsRule";
import { WashingtonPostRule } from "~/lib/rules/WashingtonPostRule";
import { WSJRule } from "~/lib/rules/WSJRule";

describe("Rules System", () => {
  let feedsMap: FeedsMap;

  beforeEach(() => {
    feedsMap = new Map();
  });

  describe("Registry", () => {
    it("should have all rules registered", () => {
      const rules = getRegisteredRules();
      expect(rules.length).toBe(14);
      expect(rules.map((r) => r.name)).toContain("Reddit");
      expect(rules.map((r) => r.name)).toContain("YouTube");
      expect(rules.map((r) => r.name)).toContain("GitHub");
      expect(rules.map((r) => r.name)).toContain("Stack Exchange");
      expect(rules.map((r) => r.name)).toContain("Steam");
      expect(rules.map((r) => r.name)).toContain("NYTimes");
      expect(rules.map((r) => r.name)).toContain("CNN");
      expect(rules.map((r) => r.name)).toContain("Fox News");
      expect(rules.map((r) => r.name)).toContain("BBC");
      expect(rules.map((r) => r.name)).toContain("NY Post");
      expect(rules.map((r) => r.name)).toContain("CNBC");
      expect(rules.map((r) => r.name)).toContain("CBS News");
      expect(rules.map((r) => r.name)).toContain("Washington Post");
      expect(rules.map((r) => r.name)).toContain("WSJ");
    });
  });

  describe("RedditRule", () => {
    const rule = new RedditRule();

    it("should match reddit.com hostnames", () => {
      expect(rule.matchesHostname("reddit.com")).toBe(true);
      expect(rule.matchesHostname("www.reddit.com")).toBe(true);
      expect(rule.matchesHostname("old.reddit.com")).toBe(false);
    });

    it("should extract feed for root URL", () => {
      applyRules("https://www.reddit.com/", "www.reddit.com", feedsMap);
      expect(feedsMap.has("https://www.reddit.com/.rss")).toBe(true);
    });

    it("should extract feed for subreddit with title", () => {
      applyRules(
        "https://www.reddit.com/r/programming",
        "www.reddit.com",
        feedsMap,
      );
      expect(feedsMap.get("https://www.reddit.com/r/programming.rss")).toEqual({
        title: "r/programming RSS Feed",
        isFromRule: true,
      });
    });
  });

  describe("YouTubeRule", () => {
    const rule = new YouTubeRule();

    it("should match youtube.com hostnames", () => {
      expect(rule.matchesHostname("youtube.com")).toBe(true);
      expect(rule.matchesHostname("www.youtube.com")).toBe(true);
      expect(rule.matchesHostname("m.youtube.com")).toBe(false);
    });

    it("should extract channel feed", () => {
      applyRules(
        "https://www.youtube.com/channel/UCexample123",
        "www.youtube.com",
        feedsMap,
      );
      expect(
        feedsMap.has(
          "https://www.youtube.com/feeds/videos.xml?channel_id=UCexample123",
        ),
      ).toBe(true);
    });

    it("should extract user feed", () => {
      applyRules(
        "https://www.youtube.com/user/TestUser",
        "www.youtube.com",
        feedsMap,
      );
      expect(
        feedsMap.get("https://www.youtube.com/feeds/videos.xml?user=TestUser"),
      ).toEqual({ title: "YouTube - TestUser", isFromRule: true });
    });

    it("should extract playlist feed", () => {
      applyRules(
        "https://www.youtube.com/watch?v=abc&list=PLxyz123",
        "www.youtube.com",
        feedsMap,
      );
      expect(
        feedsMap.has(
          "https://www.youtube.com/feeds/videos.xml?playlist_id=PLxyz123",
        ),
      ).toBe(true);
    });

    it("should derive additional playlist feeds from channel", () => {
      applyRules(
        "https://www.youtube.com/channel/UCtest123",
        "www.youtube.com",
        feedsMap,
      );
      // Should have main channel feed + 3 derived playlists
      expect(feedsMap.size).toBe(4);
      expect(
        feedsMap.has(
          "https://www.youtube.com/feeds/videos.xml?playlist_id=UULFtest123",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://www.youtube.com/feeds/videos.xml?playlist_id=UULVtest123",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://www.youtube.com/feeds/videos.xml?playlist_id=UUSHtest123",
        ),
      ).toBe(true);
    });
  });

  describe("GitHubRule", () => {
    const rule = new GitHubRule();

    it("should match github.com hostname", () => {
      expect(rule.matchesHostname("github.com")).toBe(true);
      expect(rule.matchesHostname("www.github.com")).toBe(false);
      expect(rule.matchesHostname("gist.github.com")).toBe(false);
    });

    it("should extract feeds for repository", () => {
      applyRules("https://github.com/owner/repo", "github.com", feedsMap);
      expect(feedsMap.size).toBe(3);
      expect(feedsMap.has("https://github.com/owner/repo/commits.atom")).toBe(
        true,
      );
      expect(feedsMap.has("https://github.com/owner/repo/releases.atom")).toBe(
        true,
      );
      expect(feedsMap.has("https://github.com/owner/repo/tags.atom")).toBe(
        true,
      );
    });

    it("should not extract feeds for non-repo pages", () => {
      applyRules(
        "https://github.com/owner/repo/issues",
        "github.com",
        feedsMap,
      );
      expect(feedsMap.size).toBe(0);
    });
  });

  describe("StackExchangeRule", () => {
    const rule = new StackExchangeRule();

    it("should match Stack Exchange hostnames", () => {
      expect(rule.matchesHostname("stackoverflow.com")).toBe(true);
      expect(rule.matchesHostname("superuser.com")).toBe(true);
      expect(rule.matchesHostname("askubuntu.com")).toBe(true);
      expect(rule.matchesHostname("gaming.stackexchange.com")).toBe(true);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract tag feed", () => {
      applyRules(
        "https://stackoverflow.com/questions/tagged/javascript",
        "stackoverflow.com",
        feedsMap,
      );
      expect(
        feedsMap.get("https://stackoverflow.com/feeds/tag/javascript"),
      ).toEqual({
        title: "stackoverflow - [javascript] Questions",
        isFromRule: true,
      });
    });

    it("should extract question feed", () => {
      applyRules(
        "https://stackoverflow.com/questions/12345/some-title",
        "stackoverflow.com",
        feedsMap,
      );
      expect(
        feedsMap.get("https://stackoverflow.com/feeds/question/12345"),
      ).toEqual({
        title: "stackoverflow - Question #12345",
        isFromRule: true,
      });
    });

    it("should extract user feed", () => {
      applyRules(
        "https://stackoverflow.com/users/67890/username",
        "stackoverflow.com",
        feedsMap,
      );
      expect(
        feedsMap.get("https://stackoverflow.com/feeds/user/67890"),
      ).toEqual({
        title: "stackoverflow - User Activity",
        isFromRule: true,
      });
    });
  });

  describe("SteamRule", () => {
    const rule = new SteamRule();

    it("should match store.steampowered.com hostname", () => {
      expect(rule.matchesHostname("store.steampowered.com")).toBe(true);
      expect(rule.matchesHostname("steampowered.com")).toBe(false);
      expect(rule.matchesHostname("steamcommunity.com")).toBe(false);
    });

    it("should extract feed for app page", () => {
      applyRules(
        "https://store.steampowered.com/app/123456",
        "store.steampowered.com",
        feedsMap,
      );
      expect(
        feedsMap.get("https://store.steampowered.com/feeds/news/app/123456/"),
      ).toEqual({
        title: "Game Updates",
        isFromRule: true,
      });
    });

    it("should extract feed for app page with game name", () => {
      applyRules(
        "https://store.steampowered.com/app/123456/Half_Life_3",
        "store.steampowered.com",
        feedsMap,
      );
      expect(
        feedsMap.get("https://store.steampowered.com/feeds/news/app/123456/"),
      ).toEqual({
        title: "Half Life 3 Updates",
        isFromRule: true,
      });
    });

    it("should extract feed for news app page", () => {
      applyRules(
        "https://store.steampowered.com/news/app/123456",
        "store.steampowered.com",
        feedsMap,
      );
      expect(
        feedsMap.has("https://store.steampowered.com/feeds/news/app/123456/"),
      ).toBe(true);
    });

    it("should not extract feed for non-app pages", () => {
      applyRules(
        "https://store.steampowered.com/explore",
        "store.steampowered.com",
        feedsMap,
      );
      expect(feedsMap.size).toBe(0);
    });
  });

  describe("NYTimesRule", () => {
    const rule = new NYTimesRule();

    it("should match nytimes.com hostnames", () => {
      expect(rule.matchesHostname("nytimes.com")).toBe(true);
      expect(rule.matchesHostname("www.nytimes.com")).toBe(true);
      expect(rule.matchesHostname("rss.nytimes.com")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all NYT feeds for any nytimes.com URL", () => {
      applyRules("https://www.nytimes.com/", "www.nytimes.com", feedsMap);
      // Should have a large number of feeds
      expect(feedsMap.size).toBeGreaterThan(50);
    });

    it("should include the Home Page feed", () => {
      applyRules("https://www.nytimes.com/", "www.nytimes.com", feedsMap);
      expect(
        feedsMap.get(
          "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        ),
      ).toEqual({ title: "Home Page", isFromRule: true });
    });

    it("should include section feeds", () => {
      applyRules(
        "https://www.nytimes.com/section/world",
        "www.nytimes.com",
        feedsMap,
      );
      expect(
        feedsMap.has("https://rss.nytimes.com/services/xml/rss/nyt/World.xml"),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
        ),
      ).toBe(true);
      expect(
        feedsMap.has("https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml"),
      ).toBe(true);
    });

    it("should include opinion columnist feeds", () => {
      applyRules("https://www.nytimes.com/", "www.nytimes.com", feedsMap);
      expect(
        feedsMap.get(
          "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/paul-krugman/rss.xml",
        ),
      ).toEqual({ title: "Paul Krugman", isFromRule: true });
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://www.nytimes.com/", "www.nytimes.com", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("FoxNewsRule", () => {
    const rule = new FoxNewsRule();

    it("should match foxnews.com hostnames", () => {
      expect(rule.matchesHostname("foxnews.com")).toBe(true);
      expect(rule.matchesHostname("www.foxnews.com")).toBe(true);
      expect(rule.matchesHostname("moxie.foxnews.com")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all Fox News feeds for any foxnews.com URL", () => {
      applyRules("https://www.foxnews.com/", "www.foxnews.com", feedsMap);
      expect(feedsMap.size).toBe(11);
    });

    it("should include the Latest Headlines feed", () => {
      applyRules("https://www.foxnews.com/", "www.foxnews.com", feedsMap);
      expect(
        feedsMap.get("https://moxie.foxnews.com/google-publisher/latest.xml"),
      ).toEqual({ title: "Latest Headlines", isFromRule: true });
    });

    it("should include section feeds", () => {
      applyRules(
        "https://www.foxnews.com/politics",
        "www.foxnews.com",
        feedsMap,
      );
      expect(
        feedsMap.has("https://moxie.foxnews.com/google-publisher/world.xml"),
      ).toBe(true);
      expect(
        feedsMap.has("https://moxie.foxnews.com/google-publisher/politics.xml"),
      ).toBe(true);
      expect(
        feedsMap.has("https://moxie.foxnews.com/google-publisher/tech.xml"),
      ).toBe(true);
      expect(
        feedsMap.has("https://moxie.foxnews.com/google-publisher/us.xml"),
      ).toBe(true);
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://www.foxnews.com/", "www.foxnews.com", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("CNNRule", () => {
    const rule = new CNNRule();

    it("should match cnn.com hostnames", () => {
      expect(rule.matchesHostname("cnn.com")).toBe(true);
      expect(rule.matchesHostname("www.cnn.com")).toBe(true);
      expect(rule.matchesHostname("rss.cnn.com")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all CNN feeds for any cnn.com URL", () => {
      applyRules("https://www.cnn.com/", "www.cnn.com", feedsMap);
      expect(feedsMap.size).toBe(13);
    });

    it("should include the Top Stories feed", () => {
      applyRules("https://www.cnn.com/", "www.cnn.com", feedsMap);
      expect(feedsMap.get("http://rss.cnn.com/rss/cnn_topstories.rss")).toEqual(
        { title: "Top Stories", isFromRule: true },
      );
    });

    it("should include section feeds", () => {
      applyRules("https://www.cnn.com/politics", "www.cnn.com", feedsMap);
      expect(feedsMap.has("http://rss.cnn.com/rss/cnn_world.rss")).toBe(true);
      expect(feedsMap.has("http://rss.cnn.com/rss/cnn_tech.rss")).toBe(true);
      expect(feedsMap.has("http://rss.cnn.com/rss/cnn_health.rss")).toBe(true);
    });

    it("should include the CNN 10 podcast feed", () => {
      applyRules("https://www.cnn.com/", "www.cnn.com", feedsMap);
      expect(
        feedsMap.get("http://rss.cnn.com/services/podcasting/cnn10/rss.xml"),
      ).toEqual({ title: "CNN 10", isFromRule: true });
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://www.cnn.com/", "www.cnn.com", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("BBCRule", () => {
    const rule = new BBCRule();

    it("should match bbc.co.uk and bbc.com hostnames", () => {
      expect(rule.matchesHostname("bbc.co.uk")).toBe(true);
      expect(rule.matchesHostname("www.bbc.co.uk")).toBe(true);
      expect(rule.matchesHostname("bbc.com")).toBe(true);
      expect(rule.matchesHostname("www.bbc.com")).toBe(true);
      expect(rule.matchesHostname("feeds.bbci.co.uk")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all BBC feeds for any bbc.co.uk URL", () => {
      applyRules("https://www.bbc.co.uk/", "www.bbc.co.uk", feedsMap);
      expect(feedsMap.size).toBe(39);
    });

    it("should include the Top Stories feed", () => {
      applyRules("https://www.bbc.co.uk/", "www.bbc.co.uk", feedsMap);
      expect(feedsMap.get("http://feeds.bbci.co.uk/news/rss.xml")).toEqual({
        title: "Top Stories",
        isFromRule: true,
      });
    });

    it("should include section feeds", () => {
      applyRules("https://www.bbc.co.uk/news", "www.bbc.co.uk", feedsMap);
      expect(feedsMap.has("http://feeds.bbci.co.uk/news/world/rss.xml")).toBe(
        true,
      );
      expect(
        feedsMap.has("http://feeds.bbci.co.uk/news/technology/rss.xml"),
      ).toBe(true);
      expect(
        feedsMap.has("http://feeds.bbci.co.uk/news/business/rss.xml"),
      ).toBe(true);
    });

    it("should include regional edition feeds", () => {
      applyRules("https://www.bbc.co.uk/", "www.bbc.co.uk", feedsMap);
      expect(
        feedsMap.get("http://feeds.bbci.co.uk/news/rss.xml?edition=uk"),
      ).toEqual({ title: "Top Stories (UK Edition)", isFromRule: true });
      expect(
        feedsMap.has("http://feeds.bbci.co.uk/news/rss.xml?edition=us"),
      ).toBe(true);
      expect(
        feedsMap.has("http://feeds.bbci.co.uk/news/rss.xml?edition=int"),
      ).toBe(true);
    });

    it("should include video and audio feeds", () => {
      applyRules("https://www.bbc.co.uk/", "www.bbc.co.uk", feedsMap);
      expect(
        feedsMap.get(
          "http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml?edition=uk",
        ),
      ).toEqual({ title: "Top Stories (Video & Audio)", isFromRule: true });
      expect(
        feedsMap.has(
          "http://feeds.bbci.co.uk/news/video_and_audio/world/rss.xml",
        ),
      ).toBe(true);
    });

    it("should include other feeds", () => {
      applyRules("https://www.bbc.co.uk/", "www.bbc.co.uk", feedsMap);
      expect(
        feedsMap.has(
          "http://feeds.bbci.co.uk/news/system/latest_published_content/rss.xml",
        ),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.bbc.co.uk/blogs/theeditors/rss.xml"),
      ).toBe(true);
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://www.bbc.co.uk/", "www.bbc.co.uk", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("NYPostRule", () => {
    const rule = new NYPostRule();

    it("should match nypost.com hostnames", () => {
      expect(rule.matchesHostname("nypost.com")).toBe(true);
      expect(rule.matchesHostname("www.nypost.com")).toBe(true);
      expect(rule.matchesHostname("pagesix.com")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all NY Post feeds for any nypost.com URL", () => {
      applyRules("https://nypost.com/", "nypost.com", feedsMap);
      expect(feedsMap.size).toBe(15);
    });

    it("should include the All Stories feed", () => {
      applyRules("https://nypost.com/", "nypost.com", feedsMap);
      expect(feedsMap.get("https://nypost.com/feed/")).toEqual({
        title: "NYPost.com – All Stories",
        isFromRule: true,
      });
    });

    it("should include the PageSix feed", () => {
      applyRules("https://nypost.com/", "nypost.com", feedsMap);
      expect(feedsMap.get("https://pagesix.com/feed/")).toEqual({
        title: "PageSix.com – All Stories",
        isFromRule: true,
      });
    });

    it("should include section feeds", () => {
      applyRules("https://nypost.com/politics", "nypost.com", feedsMap);
      expect(feedsMap.has("https://nypost.com/us-news/feed/")).toBe(true);
      expect(feedsMap.has("https://nypost.com/sports/feed/")).toBe(true);
      expect(feedsMap.has("https://nypost.com/business/feed/")).toBe(true);
      expect(feedsMap.has("https://nypost.com/tech/feed/")).toBe(true);
      expect(feedsMap.has("https://nypost.com/entertainment/feed/")).toBe(true);
      expect(feedsMap.has("https://nypost.com/real-estate/feed/")).toBe(true);
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://nypost.com/", "nypost.com", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("CNBCRule", () => {
    const rule = new CNBCRule();

    it("should match cnbc.com hostnames", () => {
      expect(rule.matchesHostname("cnbc.com")).toBe(true);
      expect(rule.matchesHostname("www.cnbc.com")).toBe(true);
      expect(rule.matchesHostname("search.cnbc.com")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all CNBC feeds for any cnbc.com URL", () => {
      applyRules("https://www.cnbc.com/", "www.cnbc.com", feedsMap);
      expect(feedsMap.size).toBe(54);
    });

    it("should include the Top News feed", () => {
      applyRules("https://www.cnbc.com/", "www.cnbc.com", feedsMap);
      expect(
        feedsMap.get(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
        ),
      ).toEqual({ title: "Top News", isFromRule: true });
    });

    it("should include news section feeds", () => {
      applyRules(
        "https://www.cnbc.com/world",
        "www.cnbc.com",
        feedsMap,
      );
      expect(
        feedsMap.has(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100727362",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000113",
        ),
      ).toBe(true);
    });

    it("should include investing feeds", () => {
      applyRules("https://www.cnbc.com/", "www.cnbc.com", feedsMap);
      expect(
        feedsMap.get(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069",
        ),
      ).toEqual({ title: "Investing", isFromRule: true });
      expect(
        feedsMap.has(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=21324812",
        ),
      ).toBe(true);
    });

    it("should include blog feeds", () => {
      applyRules("https://www.cnbc.com/", "www.cnbc.com", feedsMap);
      expect(
        feedsMap.get(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19206666",
        ),
      ).toEqual({ title: "Buffett Watch", isFromRule: true });
    });

    it("should include video and TV feeds", () => {
      applyRules("https://www.cnbc.com/", "www.cnbc.com", feedsMap);
      expect(
        feedsMap.get(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839263",
        ),
      ).toEqual({ title: "Top Video", isFromRule: true });
      expect(
        feedsMap.has(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15838499",
        ),
      ).toBe(true);
    });

    it("should include European and Asian TV program feeds", () => {
      applyRules("https://www.cnbc.com/", "www.cnbc.com", feedsMap);
      expect(
        feedsMap.has(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=17501773",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15838831",
        ),
      ).toBe(true);
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://www.cnbc.com/", "www.cnbc.com", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("CBSNewsRule", () => {
    const rule = new CBSNewsRule();

    it("should match cbsnews.com hostnames", () => {
      expect(rule.matchesHostname("cbsnews.com")).toBe(true);
      expect(rule.matchesHostname("www.cbsnews.com")).toBe(true);
      expect(rule.matchesHostname("assets.cbsnews.com")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all CBS News feeds for any cbsnews.com URL", () => {
      applyRules("https://www.cbsnews.com/", "www.cbsnews.com", feedsMap);
      expect(feedsMap.size).toBe(26);
    });

    it("should include the Top Stories feed", () => {
      applyRules("https://www.cbsnews.com/", "www.cbsnews.com", feedsMap);
      expect(
        feedsMap.get("https://www.cbsnews.com/latest/rss/main"),
      ).toEqual({ title: "Top Stories", isFromRule: true });
    });

    it("should include topic feeds", () => {
      applyRules(
        "https://www.cbsnews.com/news",
        "www.cbsnews.com",
        feedsMap,
      );
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/us"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/politics"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/world"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/health"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/technology"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/science"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/space"),
      ).toBe(true);
    });

    it("should include broadcast feeds", () => {
      applyRules("https://www.cbsnews.com/", "www.cbsnews.com", feedsMap);
      expect(
        feedsMap.get("https://www.cbsnews.com/latest/rss/60-minutes"),
      ).toEqual({ title: "60 Minutes", isFromRule: true });
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/evening-news"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/face-the-nation"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/48-hours"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/sunday-morning"),
      ).toBe(true);
    });

    it("should include streaming network feeds", () => {
      applyRules("https://www.cbsnews.com/", "www.cbsnews.com", feedsMap);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/cbs-reports-custom"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/daily-report-clips"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/the-takeout-full-episodes"),
      ).toBe(true);
      expect(
        feedsMap.has("https://www.cbsnews.com/latest/rss/the-dish-full-episodes"),
      ).toBe(true);
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://www.cbsnews.com/", "www.cbsnews.com", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("WashingtonPostRule", () => {
    const rule = new WashingtonPostRule();

    it("should match washingtonpost.com hostnames", () => {
      expect(rule.matchesHostname("washingtonpost.com")).toBe(true);
      expect(rule.matchesHostname("www.washingtonpost.com")).toBe(true);
      expect(rule.matchesHostname("feeds.washingtonpost.com")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all Washington Post feeds for any washingtonpost.com URL", () => {
      applyRules(
        "https://www.washingtonpost.com/",
        "www.washingtonpost.com",
        feedsMap,
      );
      expect(feedsMap.size).toBe(24);
    });

    it("should include main section feeds", () => {
      applyRules(
        "https://www.washingtonpost.com/",
        "www.washingtonpost.com",
        feedsMap,
      );
      expect(
        feedsMap.get(
          "https://www.washingtonpost.com/arcio/rss/category/politics/",
        ),
      ).toEqual({ title: "Politics", isFromRule: true });
      expect(
        feedsMap.has(
          "https://www.washingtonpost.com/arcio/rss/category/opinions/",
        ),
      ).toBe(true);
      expect(
        feedsMap.has("https://feeds.washingtonpost.com/rss/local"),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://www.washingtonpost.com/arcio/rss/category/sports/",
        ),
      ).toBe(true);
      expect(
        feedsMap.has("https://feeds.washingtonpost.com/rss/business/technology"),
      ).toBe(true);
      expect(
        feedsMap.has("http://feeds.washingtonpost.com/rss/national"),
      ).toBe(true);
      expect(
        feedsMap.has("https://feeds.washingtonpost.com/rss/world"),
      ).toBe(true);
      expect(
        feedsMap.has("http://feeds.washingtonpost.com/rss/business"),
      ).toBe(true);
      expect(
        feedsMap.has("https://feeds.washingtonpost.com/rss/lifestyle"),
      ).toBe(true);
      expect(
        feedsMap.has("http://feeds.washingtonpost.com/rss/entertainment"),
      ).toBe(true);
    });

    it("should include sports sub-feeds", () => {
      applyRules(
        "https://www.washingtonpost.com/sports",
        "www.washingtonpost.com",
        feedsMap,
      );
      expect(
        feedsMap.has(
          "http://feeds.washingtonpost.com/rss/rss_football-insider",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "http://feeds.washingtonpost.com/rss/rss_capitals-insider",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "http://feeds.washingtonpost.com/rss/rss_nationals-journal",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "http://feeds.washingtonpost.com/rss/rss_wizards-insider",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "http://feeds.washingtonpost.com/rss/rss_soccer-insider",
        ),
      ).toBe(true);
    });

    it("should include columnist feeds", () => {
      applyRules(
        "https://www.washingtonpost.com/",
        "www.washingtonpost.com",
        feedsMap,
      );
      expect(
        feedsMap.get(
          "https://www.washingtonpost.com/arcio/rss/author/George%20F%20-Will/",
        ),
      ).toEqual({ title: "George F. Will", isFromRule: true });
    });

    it("should include local sub-feeds", () => {
      applyRules(
        "https://www.washingtonpost.com/",
        "www.washingtonpost.com",
        feedsMap,
      );
      expect(
        feedsMap.get(
          "http://feeds.washingtonpost.com/rss/rss_capital-weather-gang",
        ),
      ).toEqual({ title: "Capital Weather Gang", isFromRule: true });
      expect(
        feedsMap.has(
          "http://feeds.washingtonpost.com/rss/national/inspired-life",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://www.washingtonpost.com/arcio/rss/category/history/",
        ),
      ).toBe(true);
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules(
        "https://www.washingtonpost.com/",
        "www.washingtonpost.com",
        feedsMap,
      );
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });

  describe("WSJRule", () => {
    const rule = new WSJRule();

    it("should match wsj.com hostnames", () => {
      expect(rule.matchesHostname("wsj.com")).toBe(true);
      expect(rule.matchesHostname("www.wsj.com")).toBe(true);
      expect(rule.matchesHostname("feeds.content.dowjones.io")).toBe(false);
      expect(rule.matchesHostname("example.com")).toBe(false);
    });

    it("should extract all WSJ feeds for any wsj.com URL", () => {
      applyRules("https://www.wsj.com/", "www.wsj.com", feedsMap);
      expect(feedsMap.size).toBe(15);
    });

    it("should include the Opinion feed", () => {
      applyRules("https://www.wsj.com/", "www.wsj.com", feedsMap);
      expect(
        feedsMap.get(
          "https://feeds.content.dowjones.io/public/rss/RSSOpinion",
        ),
      ).toEqual({ title: "Opinion", isFromRule: true });
    });

    it("should include news section feeds", () => {
      applyRules(
        "https://www.wsj.com/world",
        "www.wsj.com",
        feedsMap,
      );
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/RSSWorldNews",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/WSJcomUSBusiness",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/RSSMarketsMain",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/RSSWSJD",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/RSSUSnews",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/socialpoliticsfeed",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/socialeconomyfeed",
        ),
      ).toBe(true);
    });

    it("should include lifestyle and culture feeds", () => {
      applyRules("https://www.wsj.com/", "www.wsj.com", feedsMap);
      expect(
        feedsMap.get(
          "https://feeds.content.dowjones.io/public/rss/RSSLifestyle",
        ),
      ).toEqual({ title: "Lifestyle", isFromRule: true });
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/RSSArtsCulture",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/RSSStyle",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/rsssportsfeed",
        ),
      ).toBe(true);
    });

    it("should include personal finance and real estate feeds", () => {
      applyRules("https://www.wsj.com/", "www.wsj.com", feedsMap);
      expect(
        feedsMap.get(
          "https://feeds.content.dowjones.io/public/rss/latestnewsrealestate",
        ),
      ).toEqual({ title: "Real Estate", isFromRule: true });
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/RSSPersonalFinance",
        ),
      ).toBe(true);
      expect(
        feedsMap.has(
          "https://feeds.content.dowjones.io/public/rss/socialhealth",
        ),
      ).toBe(true);
    });

    it("should mark all feeds as isFromRule", () => {
      applyRules("https://www.wsj.com/", "www.wsj.com", feedsMap);
      for (const [, metadata] of feedsMap) {
        expect(metadata.isFromRule).toBe(true);
      }
    });
  });
});
