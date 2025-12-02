import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { lookupFeeds } from '../../lib/actions.js';

// Mock the captcha verification module
vi.mock('../../lib/captchaUtils.js', () => ({
  verifyCloudflare: vi.fn(),
}));

import { verifyCloudflare } from '../../lib/captchaUtils.js';

// Helper to create a mock Response
function createMockResponse(body, options = {}) {
  const {
    status = 200,
    ok = status >= 200 && status < 300,
    headers = {},
    url = 'https://example.com',
  } = options;

  return {
    ok,
    status,
    url,
    headers: {
      get: (name) => headers[name.toLowerCase()] || null,
    },
    text: async () => body,
    json: async () => JSON.parse(body),
  };
}

describe('lookupFeeds', () => {
  let originalFetch;

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
  describe('Input Validation', () => {
    it('returns 400 when Cloudflare token is missing', async () => {
      const result = await lookupFeeds('https://example.com', null);

      expect(result.status).toBe(400);
      expect(result.message).toBe('Cloudflare Turnstile token missing.');
    });

    it('returns 400 when Cloudflare token is empty string', async () => {
      const result = await lookupFeeds('https://example.com', '');

      expect(result.status).toBe(400);
      expect(result.message).toBe('Cloudflare Turnstile token missing.');
    });

    it('returns 403 when Cloudflare verification fails', async () => {
      verifyCloudflare.mockResolvedValue(false);

      const result = await lookupFeeds('https://example.com', 'invalid-token');

      expect(result.status).toBe(403);
      expect(result.message).toBe('Cloudflare Turnstile verification failed.');
    });

    it('returns 400 when URL is missing', async () => {
      verifyCloudflare.mockResolvedValue(true);

      const result = await lookupFeeds(null, 'valid-token');

      expect(result.status).toBe(400);
      expect(result.message).toBe("Missing 'url' field.");
    });

    it('returns 400 when URL is empty string', async () => {
      verifyCloudflare.mockResolvedValue(true);

      const result = await lookupFeeds('', 'valid-token');

      expect(result.status).toBe(400);
      expect(result.message).toBe("Missing 'url' field.");
    });

    it('returns 400 when URL format is invalid', async () => {
      verifyCloudflare.mockResolvedValue(true);

      const result = await lookupFeeds('not-a-valid-url', 'valid-token');

      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid URL format provided.');
    });

    it('returns 400 for URL without protocol', async () => {
      verifyCloudflare.mockResolvedValue(true);

      const result = await lookupFeeds('example.com', 'valid-token');

      expect(result.status).toBe(400);
      expect(result.message).toBe('Invalid URL format provided.');
    });
  });

  // ============================================
  // 2. HARDCODED RULES TESTS
  // ============================================
  describe('Hardcoded Rules', () => {
    beforeEach(() => {
      verifyCloudflare.mockResolvedValue(true);
    });

    describe('Reddit Rules', () => {
      it('generates RSS feed for Reddit root domain', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://www.reddit.com/' })
        );

        const result = await lookupFeeds('https://www.reddit.com/', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://www.reddit.com/.rss',
              title: 'Reddit RSS Feed',
            }),
          ])
        );
      });

      it('generates RSS feed for subreddit URL', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://www.reddit.com/r/programming' })
        );

        const result = await lookupFeeds('https://www.reddit.com/r/programming', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://www.reddit.com/r/programming.rss',
              title: 'r/programming RSS Feed',
            }),
          ])
        );
      });

      it('generates RSS feed for reddit.com without www', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://reddit.com/r/javascript' })
        );

        const result = await lookupFeeds('https://reddit.com/r/javascript', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://reddit.com/r/javascript.rss',
              title: 'r/javascript RSS Feed',
            }),
          ])
        );
      });
    });

    describe('YouTube Rules', () => {
      it('generates feed for YouTube channel URL', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://www.youtube.com/channel/UCvjgEDvShRsAy4JhCp7ZnDw' })
        );

        const result = await lookupFeeds('https://www.youtube.com/channel/UCvjgEDvShRsAy4JhCp7ZnDw', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCvjgEDvShRsAy4JhCp7ZnDw',
              title: 'YouTube Channel Feed',
            }),
          ])
        );
      });

      it('generates feed for YouTube user URL', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://www.youtube.com/user/testuser' })
        );

        const result = await lookupFeeds('https://www.youtube.com/user/testuser', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://www.youtube.com/feeds/videos.xml?user=testuser',
              title: 'YouTube - testuser',
            }),
          ])
        );
      });

      it('generates feed for YouTube playlist URL', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://www.youtube.com/playlist?list=PLtest123' })
        );

        const result = await lookupFeeds('https://www.youtube.com/playlist?list=PLtest123', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://www.youtube.com/feeds/videos.xml?playlist_id=PLtest123',
              title: 'YouTube Playlist Feed',
            }),
          ])
        );
      });
    });

    describe('GitHub Rules', () => {
      it('generates commits, releases, and tags feeds for GitHub repo', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://github.com/facebook/react' })
        );

        const result = await lookupFeeds('https://github.com/facebook/react', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toHaveLength(3);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://github.com/facebook/react/commits.atom',
              title: 'facebook/react - Commits',
            }),
            expect.objectContaining({
              url: 'https://github.com/facebook/react/releases.atom',
              title: 'facebook/react - Releases',
            }),
            expect.objectContaining({
              url: 'https://github.com/facebook/react/tags.atom',
              title: 'facebook/react - Tags',
            }),
          ])
        );
      });

      it('does not generate feeds for GitHub subpages', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://github.com/facebook/react/issues' })
        );

        const result = await lookupFeeds('https://github.com/facebook/react/issues', 'valid-token');

        // Should not find GitHub rule feeds since it's a subpage
        expect(result.status).toBe(404);
      });
    });

    describe('Stack Exchange Rules', () => {
      it('generates feed for Stack Overflow tagged questions', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://stackoverflow.com/questions/tagged/javascript' })
        );

        const result = await lookupFeeds('https://stackoverflow.com/questions/tagged/javascript', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://stackoverflow.com/feeds/tag/javascript',
              title: 'stackoverflow - [javascript] Questions',
            }),
          ])
        );
      });

      it('generates feed for Stack Overflow specific question', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://stackoverflow.com/questions/12345/some-question' })
        );

        const result = await lookupFeeds('https://stackoverflow.com/questions/12345/some-question', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://stackoverflow.com/feeds/question/12345',
              title: 'stackoverflow - Question #12345',
            }),
          ])
        );
      });

      it('generates feed for Stack Overflow user profile', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://stackoverflow.com/users/12345/username' })
        );

        const result = await lookupFeeds('https://stackoverflow.com/users/12345/username', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://stackoverflow.com/feeds/user/12345',
              title: 'stackoverflow - User Activity',
            }),
          ])
        );
      });

      it('generates feed for other Stack Exchange sites', async () => {
        global.fetch = vi.fn().mockResolvedValue(
          createMockResponse('<html></html>', { url: 'https://askubuntu.com/questions/tagged/networking' })
        );

        const result = await lookupFeeds('https://askubuntu.com/questions/tagged/networking', 'valid-token');

        expect(result.status).toBe(200);
        expect(result.result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              url: 'https://askubuntu.com/feeds/tag/networking',
              title: 'askubuntu - [networking] Questions',
            }),
          ])
        );
      });
    });
  });

  // ============================================
  // 3. HTML PARSING TESTS
  // ============================================
  describe('HTML Parsing', () => {
    beforeEach(() => {
      verifyCloudflare.mockResolvedValue(true);
    });

    it('finds RSS feed from link tag with application/rss+xml type', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Test Feed">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com' }))
        .mockResolvedValue(createMockResponse('<rss><channel><title>Test Feed</title></channel></rss>', {
          headers: { 'content-type': 'application/rss+xml' },
        }));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://example.com/feed.xml',
          }),
        ])
      );
    });

    it('finds Atom feed from link tag with application/atom+xml type', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/atom+xml" href="/atom.xml">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com' }))
        .mockResolvedValue(createMockResponse('<feed><title>Atom Feed</title></feed>', {
          headers: { 'content-type': 'application/atom+xml' },
        }));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://example.com/atom.xml',
          }),
        ])
      );
    });

    it('resolves relative feed URLs correctly', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="./blog/feed.xml">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com/news/' }))
        .mockResolvedValue(createMockResponse('<rss><channel><title>Blog Feed</title></channel></rss>'));

      const result = await lookupFeeds('https://example.com/news/', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://example.com/news/blog/feed.xml',
          }),
        ])
      );
    });

    it('handles absolute feed URLs in HTML', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="https://feeds.example.com/main.xml">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com' }))
        .mockResolvedValue(createMockResponse('<rss><channel><title>Main Feed</title></channel></rss>'));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://feeds.example.com/main.xml',
          }),
        ])
      );
    });

    it('handles multiple feeds in a single page', async () => {
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

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com' }))
        .mockResolvedValue(createMockResponse('<rss><channel><title>Feed</title></channel></rss>'));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toHaveLength(3);
    });

    it('ignores link tags without rel="alternate"', async () => {
      const html = `
        <html>
          <head>
            <link rel="stylesheet" type="application/rss+xml" href="/feed.xml">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn().mockResolvedValue(
        createMockResponse(html, { url: 'https://example.com' })
      );

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(404);
    });

    it('ignores link tags without href attribute', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn().mockResolvedValue(
        createMockResponse(html, { url: 'https://example.com' })
      );

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(404);
    });
  });

  // ============================================
  // 4. COMMON PATH SCRAPING TESTS
  // ============================================
  describe('Common Path Scraping', () => {
    beforeEach(() => {
      verifyCloudflare.mockResolvedValue(true);
    });

    it('falls back to checking common feed paths when no feeds in HTML', async () => {
      const htmlWithNoFeeds = '<html><head></head><body></body></html>';

      global.fetch = vi.fn().mockImplementation((url) => {
        if (url === 'https://example.com') {
          return Promise.resolve(createMockResponse(htmlWithNoFeeds, { url: 'https://example.com' }));
        }
        if (url === 'https://example.com/feed.xml') {
          return Promise.resolve(createMockResponse(
            '<rss><channel><title>Found Feed</title></channel></rss>',
            {
              url: 'https://example.com/feed.xml',
              headers: { 'content-type': 'application/rss+xml' },
            }
          ));
        }
        // All other paths return 404
        return Promise.resolve(createMockResponse('Not Found', { status: 404, ok: false }));
      });

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://example.com/feed.xml',
          }),
        ])
      );
    });

    it('validates content-type before accepting feed from common path', async () => {
      const htmlWithNoFeeds = '<html><head></head><body></body></html>';

      global.fetch = vi.fn().mockImplementation((url) => {
        if (url === 'https://example.com') {
          return Promise.resolve(createMockResponse(htmlWithNoFeeds, { url: 'https://example.com' }));
        }
        // /feed.xml returns HTML content-type (not a valid feed)
        if (url === 'https://example.com/feed.xml') {
          return Promise.resolve(createMockResponse(
            '<html>Not a feed</html>',
            {
              url: 'https://example.com/feed.xml',
              headers: { 'content-type': 'text/html' },
            }
          ));
        }
        return Promise.resolve(createMockResponse('Not Found', { status: 404, ok: false }));
      });

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(404);
      expect(result.message).toBe('No feeds found on this site.');
    });

    it('accepts feed with xml content-type', async () => {
      const htmlWithNoFeeds = '<html><head></head><body></body></html>';

      global.fetch = vi.fn().mockImplementation((url) => {
        if (url === 'https://example.com') {
          return Promise.resolve(createMockResponse(htmlWithNoFeeds, { url: 'https://example.com' }));
        }
        if (url === 'https://example.com/rss.xml') {
          return Promise.resolve(createMockResponse(
            '<rss><channel><title>RSS Feed</title></channel></rss>',
            {
              url: 'https://example.com/rss.xml',
              headers: { 'content-type': 'text/xml' },
            }
          ));
        }
        return Promise.resolve(createMockResponse('Not Found', { status: 404, ok: false }));
      });

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://example.com/rss.xml',
          }),
        ])
      );
    });

    it('does not check common paths if feeds already found in HTML', async () => {
      const htmlWithFeed = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/blog.xml">
          </head>
          <body></body>
        </html>
      `;

      const fetchMock = vi.fn().mockImplementation((url) => {
        if (url === 'https://example.com') {
          return Promise.resolve(createMockResponse(htmlWithFeed, { url: 'https://example.com' }));
        }
        return Promise.resolve(createMockResponse('<rss><channel><title>Blog</title></channel></rss>'));
      });
      global.fetch = fetchMock;

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      // Should only fetch the main URL and the feed title, not common paths
      const calledUrls = fetchMock.mock.calls.map(call => call[0]);
      expect(calledUrls).not.toContain('https://example.com/feed.xml');
      expect(calledUrls).not.toContain('https://example.com/rss.xml');
    });
  });

  // ============================================
  // 5. ERROR HANDLING TESTS
  // ============================================
  describe('Error Handling', () => {
    beforeEach(() => {
      verifyCloudflare.mockResolvedValue(true);
    });

    it('returns 502 when fetch throws network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(502);
      expect(result.message).toContain('Error fetching URL');
    });

    it('returns 502 for non-2xx response', async () => {
      global.fetch = vi.fn().mockResolvedValue(
        createMockResponse('Forbidden', { status: 403, ok: false })
      );

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(502);
      expect(result.message).toContain('Unable to access URL: Status 403');
    });

    it('returns 502 for 500 server error', async () => {
      global.fetch = vi.fn().mockResolvedValue(
        createMockResponse('Internal Server Error', { status: 500, ok: false })
      );

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(502);
      expect(result.message).toContain('Unable to access URL: Status 500');
    });

    it('returns 404 when no feeds found on site', async () => {
      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('example.com') && !url.includes('feed') && !url.includes('rss') && !url.includes('atom')) {
          return Promise.resolve(createMockResponse('<html><body>No feeds here</body></html>', {
            url: 'https://example.com',
          }));
        }
        return Promise.resolve(createMockResponse('Not Found', { status: 404, ok: false }));
      });

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(404);
      expect(result.message).toBe('No feeds found on this site.');
    });

    it('succeeds with rules even when fetch fails for URLs with hardcoded rules', async () => {
      // Simulate network failure, but GitHub rules should still work
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await lookupFeeds('https://github.com/facebook/react', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result).toHaveLength(3);
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://github.com/facebook/react/commits.atom',
          }),
        ])
      );
    });

    it('handles redirects and uses final URL for parsing', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/feed.xml">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, {
          url: 'https://www.example.com/', // Redirected URL
        }))
        .mockResolvedValue(createMockResponse('<rss><channel><title>Feed</title></channel></rss>'));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      // Feed URL should be resolved relative to the final redirected URL
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: 'https://www.example.com/feed.xml',
          }),
        ])
      );
    });

    it('allows 304 Not Modified response', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/feed.xml">
          </head>
          <body></body>
        </html>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, {
          status: 304,
          ok: false,
          url: 'https://example.com',
        }))
        .mockResolvedValue(createMockResponse('<rss><channel><title>Feed</title></channel></rss>'));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
    });
  });

  // ============================================
  // 6. FEED TITLE FETCHING TESTS
  // ============================================
  describe('Feed Title Fetching', () => {
    beforeEach(() => {
      verifyCloudflare.mockResolvedValue(true);
    });

    it('extracts title from RSS feed', async () => {
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

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com' }))
        .mockResolvedValueOnce(createMockResponse(rssFeed));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result[0].title).toBe('My Awesome Blog');
    });

    it('extracts title from Atom feed', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/atom+xml" href="/atom.xml">
          </head>
        </html>
      `;

      const atomFeed = `
        <?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>Atom Blog Feed</title>
          <entry><title>Entry 1</title></entry>
        </feed>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com' }))
        .mockResolvedValueOnce(createMockResponse(atomFeed));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result[0].title).toBe('Atom Blog Feed');
    });

    it('uses hardcoded title for rule-based feeds', async () => {
      global.fetch = vi.fn().mockResolvedValue(
        createMockResponse('<html></html>', { url: 'https://github.com/owner/repo' })
      );

      const result = await lookupFeeds('https://github.com/owner/repo', 'valid-token');

      expect(result.status).toBe(200);
      // Hardcoded titles should be used, not fetched
      expect(result.result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'owner/repo - Commits',
          }),
          expect.objectContaining({
            title: 'owner/repo - Releases',
          }),
          expect.objectContaining({
            title: 'owner/repo - Tags',
          }),
        ])
      );
    });

    it('returns null title when feed fetch fails', async () => {
      const html = `
        <html>
          <head>
            <link rel="alternate" type="application/rss+xml" href="/feed.xml">
          </head>
        </html>
      `;

      global.fetch = vi.fn()
        .mockResolvedValueOnce(createMockResponse(html, { url: 'https://example.com' }))
        .mockRejectedValueOnce(new Error('Feed fetch failed'));

      const result = await lookupFeeds('https://example.com', 'valid-token');

      expect(result.status).toBe(200);
      expect(result.result[0].title).toBeNull();
    });
  });
});

