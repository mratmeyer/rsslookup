import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * Rule for discovering RSS feeds on GitHub repositories.
 * Provides feeds for commits, releases, and tags.
 */
export class GitHubRule implements SiteRule {
  readonly name = "GitHub";

  matchesHostname(hostname: string): boolean {
    return hostname === "github.com";
  }

  extractFeeds(context: RuleContext, feedsMap: FeedsMap): void {
    const { cleanedURL, pathname } = context;

    // Match /username/reponame (won't match subpages like /issues, /pulls)
    const repoMatch = pathname.match(/^\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
    if (repoMatch) {
      const repoName = `${repoMatch[1]}/${repoMatch[2]}`;
      feedsMap.set(`${cleanedURL}/commits.atom`, `${repoName} - Commits`);
      feedsMap.set(`${cleanedURL}/releases.atom`, `${repoName} - Releases`);
      feedsMap.set(`${cleanedURL}/tags.atom`, `${repoName} - Tags`);
    }
  }
}
