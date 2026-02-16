import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { lookupFeeds } from "~/lib/actions";

// Helper to create a mock Response
interface MockResponseOptions {
  status?: number;
  ok?: boolean;
  headers?: Record<string, string>;
  url?: string;
}

function createMockResponse(
  body: string,
  options: MockResponseOptions = {},
): Partial<Response> {
  const {
    status = 200,
    ok = status >= 200 && status < 300,
    headers = {},
    url = "https://example.com",
  } = options;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });

  return {
    ok,
    status,
    url,
    body: stream,
    headers: {
      get: (name: string) => headers[name.toLowerCase()] || null,
    } as Headers,
    text: async () => body,
    json: async () => JSON.parse(body),
  };
}

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
    it("returns 400 when URL is missing", async () => {
      const result = await lookupFeeds("");

      expect(result.status).toBe(400);
      expect(result.message).toBe("Missing 'url' field.");
    });

    it("returns 400 when URL format is invalid", async () => {
      const result = await lookupFeeds("not-a-valid-url");

      expect(result.status).toBe(400);
      expect(result.message).toBe("Invalid URL format provided.");
    });

    it("returns 400 for URL without protocol", async () => {
      const result = await lookupFeeds("example.com");

      expect(result.status).toBe(400);
      expect(result.message).toBe("Invalid URL format provided.");
    });

    it("returns 400 for non-http scheme", async () => {
      const result = await lookupFeeds("ftp://example.com");

      expect(result.status).toBe(400);
      expect(result.message).toBe("Only http and https URLs are supported.");
    });

    it("returns 400 for IP address URL", async () => {
      const result = await lookupFeeds("http://192.168.1.1/feed");

      expect(result.status).toBe(400);
      expect(result.message).toBe(
        "Please provide a domain name instead of an IP address.",
      );
    });

    it("returns 400 for localhost URL", async () => {
      const result = await lookupFeeds("http://localhost/feed");

      expect(result.status).toBe(400);
      expect(result.message).toBe(
        "URLs pointing to local or internal networks are not allowed.",
      );
    });

    it("returns 400 for hostname without valid domain", async () => {
      const result = await lookupFeeds("http://myserver/feed");

      expect(result.status).toBe(400);
      expect(result.message).toBe(
        "Please provide a URL with a valid domain name (e.g., example.com).",
      );
    });
  });

  // ============================================
  // 2. HTML PARSING TESTS
  // ============================================
  describe("HTML Parsing", () => {
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
          createMockResponse(html, { url: "https://example.com" }),
        )
        .mockResolvedValue(
          createMockResponse(
            "<rss><channel><title>Test Feed</title></channel></rss>",
            {
              headers: { "content-type": "application/rss+xml" },
            },
          ),
        );

      const result = await lookupFeeds("https://example.com");

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: "https://example.com/feed.xml",
          }),
        ]),
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
          createMockResponse(html, { url: "https://example.com" }),
        )
        .mockResolvedValue(
          createMockResponse(
            "<rss><channel><title>Feed</title></channel></rss>",
          ),
        );

      const result = await lookupFeeds("https://example.com");

      expect(result.status).toBe(200);
      expect(result.result).toHaveLength(3);
    });
  });

  // ============================================
  // 3. ERROR HANDLING TESTS
  // ============================================
  describe("Error Handling", () => {
    it("returns 502 when fetch throws network error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await lookupFeeds("https://example.com");

      expect(result.status).toBe(502);
      expect(result.message).toContain("Error fetching URL");
    });

    it("returns 502 for non-2xx response", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValue(
          createMockResponse("Forbidden", { status: 403, ok: false }),
        );

      const result = await lookupFeeds("https://example.com");

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
            }),
          );
        }
        return Promise.resolve(
          createMockResponse("Not Found", { status: 404, ok: false }),
        );
      });

      const result = await lookupFeeds("https://example.com");

      expect(result.status).toBe(404);
      expect(result.message).toBe("No feeds found on this site.");
    });

    it("succeeds with rules even when fetch fails for URLs with hardcoded rules", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      const result = await lookupFeeds("https://github.com/facebook/react");

      expect(result.status).toBe(200);
      expect(result.result).toHaveLength(3);
    });
  });

  // ============================================
  // 4. FEED TITLE FETCHING TESTS
  // ============================================
  describe("Feed Title Fetching", () => {
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
          createMockResponse(html, { url: "https://example.com" }),
        )
        .mockResolvedValueOnce(createMockResponse(rssFeed));

      const result = await lookupFeeds("https://example.com");

      expect(result.status).toBe(200);
      expect(result.result?.[0].title).toBe("My Awesome Blog");
    });

    it("uses hardcoded title for rule-based feeds", async () => {
      global.fetch = vi.fn().mockResolvedValue(
        createMockResponse("<html></html>", {
          url: "https://github.com/owner/repo",
        }),
      );

      const result = await lookupFeeds("https://github.com/owner/repo");

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
        ]),
      );
    });
  });
});
