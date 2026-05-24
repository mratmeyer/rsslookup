import { describe, it, expect } from "vitest";
import { parseFeedInfo } from "~/lib/feedInfo";

describe("parseFeedInfo", () => {
  it("parses RSS feed with items and pubDate dates", () => {
    const xml = `
      <rss version="2.0">
        <channel>
          <title>Test Blog</title>
          <description>A blog about testing things</description>
          <item>
            <title>Post 3</title>
            <link>https://example.com/post-3</link>
            <description>Newest post</description>
            <pubDate>Wed, 10 Jan 2024 00:00:00 GMT</pubDate>
          </item>
          <item>
            <title>Post 2</title>
            <link>https://example.com/post-2</link>
            <pubDate>Wed, 03 Jan 2024 00:00:00 GMT</pubDate>
          </item>
          <item>
            <title>Post 1</title>
            <pubDate>Wed, 27 Dec 2023 00:00:00 GMT</pubDate>
          </item>
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.title).toBe("Test Blog");
    expect(info.description).toBe("A blog about testing things");
    expect(info.itemCount).toBe(3);
    expect(info.lastPostDate).toBe("2024-01-10T00:00:00.000Z");
    expect(info.postFrequency).toBe("~1 post/week");
    expect(info.posts[0]).toEqual({
      title: "Post 3",
      url: "https://example.com/post-3",
      publishedAt: "2024-01-10T00:00:00.000Z",
      summary: "Newest post",
    });
  });

  it("parses Atom feed with subtitle and published dates", () => {
    const xml = `
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Atom Blog</title>
        <subtitle>An Atom-powered blog</subtitle>
        <entry>
          <title>Entry 2</title>
          <link href="https://example.com/entry-2" />
          <summary>Latest Atom entry</summary>
          <published>2024-01-15T00:00:00Z</published>
        </entry>
        <entry>
          <title>Entry 1</title>
          <published>2024-01-01T00:00:00Z</published>
        </entry>
      </feed>
    `;

    const info = parseFeedInfo(xml);

    expect(info.title).toBe("Atom Blog");
    expect(info.description).toBe("An Atom-powered blog");
    expect(info.itemCount).toBe(2);
    expect(info.lastPostDate).toBe("2024-01-15T00:00:00.000Z");
    expect(info.postFrequency).toBe("~2 posts/month");
    expect(info.posts[0]).toEqual({
      title: "Entry 2",
      url: "https://example.com/entry-2",
      publishedAt: "2024-01-15T00:00:00.000Z",
      summary: "Latest Atom entry",
    });
  });

  it("parses Atom feed with updated dates", () => {
    const xml = `
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Updated Blog</title>
        <entry>
          <title>Entry 2</title>
          <updated>2024-01-08T00:00:00Z</updated>
        </entry>
        <entry>
          <title>Entry 1</title>
          <updated>2024-01-01T00:00:00Z</updated>
        </entry>
      </feed>
    `;

    const info = parseFeedInfo(xml);

    expect(info.itemCount).toBe(2);
    expect(info.lastPostDate).toBe("2024-01-08T00:00:00.000Z");
    expect(info.postFrequency).toBe("~1 post/week");
  });

  it("prefers Atom alternate links over self links", () => {
    const xml = `
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Linked Atom Blog</title>
        <entry>
          <title>Entry</title>
          <link rel="self" href="https://example.com/feed/entry-api" />
          <link rel="alternate" href="https://example.com/posts/entry" />
          <updated>2024-01-08T00:00:00Z</updated>
        </entry>
      </feed>
    `;

    const info = parseFeedInfo(xml);

    expect(info.posts[0].url).toBe("https://example.com/posts/entry");
  });

  it("returns no frequency for feed with 0 items", () => {
    const xml = `
      <rss version="2.0">
        <channel>
          <title>Empty Blog</title>
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.title).toBe("Empty Blog");
    expect(info.itemCount).toBe(0);
    expect(info.lastPostDate).toBeNull();
    expect(info.postFrequency).toBeNull();
  });

  it("returns no frequency for feed with 1 item", () => {
    const xml = `
      <rss version="2.0">
        <channel>
          <title>Single Post</title>
          <item>
            <title>Only Post</title>
            <pubDate>Wed, 10 Jan 2024 00:00:00 GMT</pubDate>
          </item>
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.itemCount).toBe(1);
    expect(info.lastPostDate).toBe("2024-01-10T00:00:00.000Z");
    expect(info.postFrequency).toBeNull();
  });

  it("returns null description when absent", () => {
    const xml = `
      <rss version="2.0">
        <channel>
          <title>No Desc Blog</title>
          <item><title>Post</title></item>
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.title).toBe("No Desc Blog");
    expect(info.description).toBeNull();
  });

  it("ignores description inside items", () => {
    const xml = `
      <rss version="2.0">
        <channel>
          <title>Blog</title>
          <description>Channel description</description>
          <item>
            <title>Post</title>
            <description>Item description should be ignored</description>
          </item>
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.description).toBe("Channel description");
  });

  it("handles malformed/empty XML", () => {
    const info = parseFeedInfo("");

    expect(info.title).toBeNull();
    expect(info.itemCount).toBe(0);
    expect(info.lastPostDate).toBeNull();
    expect(info.postFrequency).toBeNull();
  });

  it("handles garbage XML gracefully", () => {
    const info = parseFeedInfo("<not><valid>xml<foo");

    expect(info.title).toBeNull();
    expect(info.itemCount).toBe(0);
  });

  it("strips markup and truncates preview summaries", () => {
    const longText = "word ".repeat(80);
    const xml = `
      <rss version="2.0">
        <channel>
          <title>Summary Blog</title>
          <item>
            <title>Post</title>
            <description><![CDATA[<p>${longText}</p><a href="https://example.com">Read</a>]]></description>
          </item>
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.posts[0].summary).not.toContain("<p>");
    expect(info.posts[0].summary).not.toContain("<a");
    expect(info.posts[0].summary?.length).toBeLessThanOrEqual(240);
    expect(info.posts[0].summary).toMatch(/\.\.\.$/);
  });

  it("calculates daily frequency", () => {
    const items = Array.from({ length: 10 }, (_, i) => {
      const date = new Date("2024-01-10T00:00:00Z");
      date.setDate(date.getDate() - i);
      return `<item><pubDate>${date.toUTCString()}</pubDate></item>`;
    }).join("\n");

    const xml = `
      <rss version="2.0">
        <channel>
          <title>Daily Blog</title>
          ${items}
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.itemCount).toBe(10);
    expect(info.postFrequency).toBe("~1 post/day");
  });

  it("calculates monthly frequency", () => {
    const xml = `
      <rss version="2.0">
        <channel>
          <title>Monthly Blog</title>
          <item><pubDate>Sat, 01 Jun 2024 00:00:00 GMT</pubDate></item>
          <item><pubDate>Wed, 01 May 2024 00:00:00 GMT</pubDate></item>
          <item><pubDate>Mon, 01 Apr 2024 00:00:00 GMT</pubDate></item>
        </channel>
      </rss>
    `;

    const info = parseFeedInfo(xml);

    expect(info.itemCount).toBe(3);
    expect(info.postFrequency).toBe("~1 post/month");
  });
});
