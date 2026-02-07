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

describe("Rules System", () => {
  let feedsMap: FeedsMap;

  beforeEach(() => {
    feedsMap = new Map();
  });

  describe("Registry", () => {
    it("should have all rules registered", () => {
      const rules = getRegisteredRules();
      expect(rules.length).toBe(7);
      expect(rules.map((r) => r.name)).toContain("Reddit");
      expect(rules.map((r) => r.name)).toContain("YouTube");
      expect(rules.map((r) => r.name)).toContain("GitHub");
      expect(rules.map((r) => r.name)).toContain("Stack Exchange");
      expect(rules.map((r) => r.name)).toContain("Steam");
      expect(rules.map((r) => r.name)).toContain("NYTimes");
      expect(rules.map((r) => r.name)).toContain("CNN");
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
});
