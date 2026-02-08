import type { SiteRule, RuleContext } from "./SiteRule";

/**
 * Base class for rules that serve a static list of feeds for matching hostnames.
 * Eliminates boilerplate for news sites and similar static feed lists.
 */
export class StaticFeedRule implements SiteRule {
  readonly name: string;
  private readonly hostnames: readonly string[];
  private readonly feeds: readonly { url: string; title: string }[];

  constructor(
    name: string,
    hostnames: readonly string[],
    feeds: readonly { url: string; title: string }[],
  ) {
    this.name = name;
    this.hostnames = hostnames;
    this.feeds = feeds;
  }

  matchesHostname(hostname: string): boolean {
    return this.hostnames.includes(hostname);
  }

  extractFeeds(context: RuleContext): void {
    for (const feed of this.feeds) {
      context.feedsMap.set(feed.url, { title: feed.title, isFromRule: true });
    }
  }
}
