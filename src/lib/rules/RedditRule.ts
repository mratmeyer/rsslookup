import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * Rule for discovering RSS feeds on Reddit.
 * Handles reddit.com URLs by appending .rss to paths.
 */
export class RedditRule implements SiteRule {
    readonly name = "Reddit";

    private readonly validHostnames = ["www.reddit.com", "reddit.com"];

    matchesHostname(hostname: string): boolean {
        return this.validHostnames.includes(hostname);
    }

    extractFeeds(context: RuleContext, feedsMap: FeedsMap): void {
        const { cleanedURL, pathname } = context;

        if (pathname === "/") {
            // Root domain needs trailing slash before .rss
            feedsMap.set(cleanedURL + "/.rss", "Reddit RSS Feed");
        } else {
            // Extract subreddit name for a better title
            const subredditMatch = pathname.match(/^\/r\/([\w]+)/);
            const title = subredditMatch
                ? `r/${subredditMatch[1]} RSS Feed`
                : "Reddit RSS Feed";
            feedsMap.set(cleanedURL + ".rss", title);
        }
    }
}
