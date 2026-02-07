import { cleanURL } from "../urlUtils";
import type { FeedsMap } from "../types";
import type { SiteRule, RuleContext } from "./SiteRule";
import { RedditRule } from "./RedditRule";
import { YouTubeRule } from "./YouTubeRule";
import { GitHubRule } from "./GitHubRule";
import { StackExchangeRule } from "./StackExchangeRule";
import { SteamRule } from "./SteamRule";
import { NYTimesRule } from "./NYTimesRule";
import { CNNRule } from "./CNNRule";
import { FoxNewsRule } from "./FoxNewsRule";
import { BBCRule } from "./BBCRule";
import { NYPostRule } from "./NYPostRule";
import { CNBCRule } from "./CNBCRule";
import { CBSNewsRule } from "./CBSNewsRule";
import { WashingtonPostRule } from "./WashingtonPostRule";
import { WSJRule } from "./WSJRule";

// Export types and classes for external use
export type { SiteRule, RuleContext } from "./SiteRule";
export { RedditRule } from "./RedditRule";
export { YouTubeRule } from "./YouTubeRule";
export { GitHubRule } from "./GitHubRule";
export { StackExchangeRule } from "./StackExchangeRule";
export { SteamRule } from "./SteamRule";
export { NYTimesRule } from "./NYTimesRule";
export { CNNRule } from "./CNNRule";
export { FoxNewsRule } from "./FoxNewsRule";
export { BBCRule } from "./BBCRule";
export { NYPostRule } from "./NYPostRule";
export { CNBCRule } from "./CNBCRule";
export { CBSNewsRule } from "./CBSNewsRule";
export { WashingtonPostRule } from "./WashingtonPostRule";
export { WSJRule } from "./WSJRule";

/**
 * Registry of all available site rules.
 * Add new rules here to enable them.
 */
const rules: SiteRule[] = [
  new RedditRule(),
  new YouTubeRule(),
  new GitHubRule(),
  new StackExchangeRule(),
  new SteamRule(),
  new NYTimesRule(),
  new CNNRule(),
  new FoxNewsRule(),
  new BBCRule(),
  new NYPostRule(),
  new CNBCRule(),
  new CBSNewsRule(),
  new WashingtonPostRule(),
  new WSJRule(),
];

/**
 * Apply all matching rules to extract feeds from a URL.
 * @param fullURL - The full URL to parse
 * @param hostname - The site hostname
 * @param feedsMap - Map to add discovered feeds to
 */
export function applyRules(
  fullURL: string,
  hostname: string,
  feedsMap: FeedsMap,
): void {
  try {
    const cleanedURL = cleanURL(fullURL);
    if (!cleanedURL) return;

    let urlObject: URL;
    try {
      urlObject = new URL(cleanedURL);
    } catch {
      // Invalid URL - can't apply rules
      return;
    }

    const context: RuleContext = {
      fullURL,
      cleanedURL,
      hostname,
      pathname: urlObject.pathname,
      origin: urlObject.origin,
      searchParams: urlObject.searchParams,
      feedsMap,
    };

    // Apply each matching rule
    for (const rule of rules) {
      if (rule.matchesHostname(hostname)) {
        try {
          rule.extractFeeds(context, feedsMap);
        } catch {
          // Individual rule failure shouldn't break other rules
        }
      }
    }
  } catch {
    // Silently ignore errors - rule parsing should not break the lookup
  }
}

/**
 * Get all registered rules (useful for testing or introspection)
 */
export function getRegisteredRules(): readonly SiteRule[] {
  return rules;
}
