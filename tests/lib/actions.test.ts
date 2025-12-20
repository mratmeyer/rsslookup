import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { lookupFeeds } from "~/lib/actions";

// Mock the captcha verification module
vi.mock("~/lib/captchaUtils", () => ({
  verifyCloudflare: vi.fn(),
}));

import { verifyCloudflare } from "~/lib/captchaUtils";

const mockVerifyCloudflare = verifyCloudflare as ReturnType<typeof vi.fn>;

// Helper to create a mock Response
interface MockResponseOptions {
  status?: number;
  ok?: boolean;
  headers?: Record<string, string>;
  url?: string;
}

function createMockResponse(
  body: string,
  options: MockResponseOptions = {}
): Partial<Response> {
  const {
    status = 200,
    ok = status >= 200 && status < 300,
    headers = {},
    url = "https://example.com",
  } = options;

  return {
    ok,
    status,
    url,
    headers: {
      get: (name: string) => headers[name.toLowerCase()] || null,
    } as Headers,
    text: async () => body,
    json: async () => JSON.parse(body),
  };
}

// Test secret for mocking
const TEST_SECRET = "test-turnstile-secret";

describe("lookupFeeds", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ============================================
  // 1. INPUT VALIDATION TESTS
  // ============================================
  describe("Input Validation", () => {
    it("returns 400 when Cloudflare token is missing", async () => {
      const result = await lookupFeeds(
        "https://example.com",
        "",
        TEST_SECRET
      );

      expect(result.status).toBe(400);
      expect(result.message).toBe("Cloudflare Turnstile token missing.");
    });

    it("returns 403 when Cloudflare verification fails", async () => {
      mockVerifyCloudflare.mockResolvedValue(false);

      const result = await lookupFeeds(
        "https://example.com",
        "invalid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(403);
      expect(result.message).toBe("Cloudflare Turnstile verification failed.");
    });

    it("passes client IP to Cloudflare verification when provided", async () => {
      mockVerifyCloudflare.mockResolvedValue(true);
      const testIP = "1.2.3.4";

      await lookupFeeds(
        "https://example.com",
        "valid-token",
        TEST_SECRET,
        testIP
      );

      expect(mockVerifyCloudflare).toHaveBeenCalledWith(
        "valid-token",
        TEST_SECRET,
        testIP
      );
    });

    it("returns 400 when URL is missing", async () => {
      mockVerifyCloudflare.mockResolvedValue(true);

      const result = await lookupFeeds("", "valid-token", TEST_SECRET);

      expect(result.status).toBe(400);
      expect(result.message).toBe("Missing 'url' field.");
    });

    it("returns 400 when URL format is invalid", async () => {
      mockVerifyCloudflare.mockResolvedValue(true);

      const result = await lookupFeeds(
        "not-a-valid-url",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(400);
      expect(result.message).toBe("Invalid URL format provided.");
    });

    it("returns 400 for URL without protocol", async () => {
      mockVerifyCloudflare.mockResolvedValue(true);

      const result = await lookupFeeds("example.com", "valid-token", TEST_SECRET);

      expect(result.status).toBe(400);
      expect(result.message).toBe("Invalid URL format provided.");
    });
  });

  // ============================================
  // 2. HARDCODED RULES TESTS
  // ============================================
  describe("Hardcoded Rules", () => {
    beforeEach(() => {
      mockVerifyCloudflare.mockResolvedValue(true);
    });

    describe("Reddit Rules", () => {
      it("generates RSS feed for Reddit root domain", async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse("<html></html>", {
            url: "https://www.reddit.com/",
          })
        );

        const result = await lookupFeeds(
          "https://www.reddit.com/",
          "valid-token",
          TEST_SECRET
        );

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: "https://www.reddit.com/.rss",
              title: "Reddit RSS Feed",
            }),
          ])
        );
      });

      it("generates RSS feed for subreddit URL", async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse("<html></html>", {
            url: "https://www.reddit.com/r/programming",
          })
        );

        const result = await lookupFeeds(
          "https://www.reddit.com/r/programming",
          "valid-token",
          TEST_SECRET
        );

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: "https://www.reddit.com/r/programming.rss",
              title: "r/programming RSS Feed",
            }),
          ])
        );
      });
    });

    describe("YouTube Rules", () => {
      it("generates feed for YouTube channel URL", async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse("<html></html>", {
            url: "https://www.youtube.com/channel/UCvjgEDvShRsAy4JhCp7ZnDw",
          })
        );

        const result = await lookupFeeds(
          "https://www.youtube.com/channel/UCvjgEDvShRsAy4JhCp7ZnDw",
          "valid-token",
          TEST_SECRET
        );

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCvjgEDvShRsAy4JhCp7ZnDw",
              title: "YouTube Channel Feed",
            }),
          ])
        );
      });
    });

    describe("GitHub Rules", () => {
      it("generates commits, releases, and tags feeds for GitHub repo", async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse("<html></html>", {
            url: "https://github.com/facebook/react",
          })
        );

        const result = await lookupFeeds(
          "https://github.com/facebook/react",
          "valid-token",
          TEST_SECRET
        );

        expect(result.status).toBe(200);
        expect(result.result).toHaveLength(3);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: "https://github.com/facebook/react/commits.atom",
              title: "facebook/react - Commits",
            }),
            expect.objectContaining({
              url: "https://github.com/facebook/react/releases.atom",
              title: "facebook/react - Releases",
            }),
            expect.objectContaining({
              url: "https://github.com/facebook/react/tags.atom",
              title: "facebook/react - Tags",
            }),
          ])
        );
      });
    });
  });

  // ============================================
  // 3. HTML PARSING TESTS
  // ============================================
  describe("HTML Parsing", () => {
    beforeEach(() => {
      mockVerifyCloudflare.mockResolvedValue(true);
    });

    it("finds RSS feed from link tag with application/rss+xml type", async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Test Feed">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(
          createMockResponse(html, { url: "https://example.com" })
        )
        .mockResolvedValue(
          createMockResponse(
            "<rss><channel><title>Test Feed</title></channel></rss>",
            {
              headers: { "content-type": "application/rss+xml" },
            }
          )
        );

      const result = await lookupFeeds(
        "https://example.com",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: "https://example.com/feed.xml",
          }),
        ])
      );
    });

    it("handles multiple feeds in a single page", async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Main Feed">
            <link rel="alternate" type="application/atom+xml" href="/atom.xml" title="Atom Feed">
            <link rel="alternate" type="application/rss+xml" href="/comments.xml" title="Comments">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(
          createMockResponse(html, { url: "https://example.com" })
        )
        .mockResolvedValue(
          createMockResponse(
            "<rss><channel><title>Feed</title></channel></rss>"
          )
        );

      const result = await lookupFeeds(
        "https://example.com",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(200);
      expect(result.result).toHaveLength(3);
    });
  });

  // ============================================
  // 4. ERROR HANDLING TESTS
  // ============================================
  describe("Error Handling", () => {
    beforeEach(() => {
      mockVerifyCloudflare.mockResolvedValue(true);
    });

    it("returns 502 when fetch throws network error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await lookupFeeds(
        "https://example.com",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(502);
      expect(result.message).toContain("Error fetching URL");
    });

    it("returns 502 for non-2xx response", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValue(
          createMockResponse("Forbidden", { status: 403, ok: false })
        );

      const result = await lookupFeeds(
        "https://example.com",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(502);
      expect(result.message).toContain("Unable to access URL: Status 403");
    });

    it("returns 404 when no feeds found on site", async () => {
      global.fetch = vi.fn().mockImplementation((url) => {
        if (
          (url as string).includes("example.com") &&
          !(url as string).includes("feed") &&
          !(url as string).includes("rss") &&
          !(url as string).includes("atom")
        ) {
          return Promise.resolve(
            createMockResponse("<html><body>No feeds here</body></html>", {
              url: "https://example.com",
            })
          );
        }
        return Promise.resolve(
          createMockResponse("Not Found", { status: 404, ok: false })
        );
      });

      const result = await lookupFeeds(
        "https://example.com",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(404);
      expect(result.message).toBe("No feeds found on this site.");
    });

    it("succeeds with rules even when fetch fails for URLs with hardcoded rules", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await lookupFeeds(
        "https://github.com/facebook/react",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(200);
      expect(result.result).toHaveLength(3);
    });
  });

  // ============================================
  // 5. FEED TITLE FETCHING TESTS
  // ============================================
  describe("Feed Title Fetching", () => {
    beforeEach(() => {
      mockVerifyCloudflare.mockResolvedValue(true);
    });

    it("extracts title from RSS feed", async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/feed.xml">
          </head>
        </html>
      `;

      const rssFeed = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>My Awesome Blog</title>
            <item><title>Post 1</title></item>
          </channel>
        </rss>
      `;

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(
          createMockResponse(html, { url: "https://example.com" })
        )
        .mockResolvedValueOnce(createMockResponse(rssFeed));

      const result = await lookupFeeds(
        "https://example.com",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(200);
      expect(result.result?.[0].title).toBe("My Awesome Blog");
    });

    it("uses hardcoded title for rule-based feeds", async () => {
      global.fetch = vi.fn().mockResolvedValue(
        createMockResponse("<html></html>", {
          url: "https://github.com/owner/repo",
        })
      );

      const result = await lookupFeeds(
        "https://github.com/owner/repo",
        "valid-token",
        TEST_SECRET
      );

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "owner/repo - Commits",
          }),
          expect.objectContaining({
            title: "owner/repo - Releases",
          }),
          expect.objectContaining({
            title: "owner/repo - Tags",
          }),
        ])
      );
    });
  });
});
