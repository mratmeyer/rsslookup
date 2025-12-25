import type { FeedsMap } from "../types";

/**
 * Context provided to each rule for feed extraction.
 */
export interface RuleContext {
    /** Original URL as provided */
    fullURL: string;
    /** Cleaned/normalized URL */
    cleanedURL: string;
    /** Hostname, e.g. "www.reddit.com" */
    hostname: string;
    /** Pathname, e.g. "/r/programming" */
    pathname: string;
    /** Origin, e.g. "https://www.reddit.com" */
    origin: string;
    /** URL search parameters */
    searchParams: URLSearchParams;
    /** Existing feeds map (for rules that depend on prior discoveries) */
    feedsMap: FeedsMap;
}

/**
 * Interface for site-specific RSS feed discovery rules.
 * Each rule defines which hostnames it handles and how to extract feeds.
 */
export interface SiteRule {
    /** Human-readable name of the rule */
    readonly name: string;

    /**
     * Check if this rule applies to the given hostname.
     * @param hostname - The hostname to check
     * @returns true if this rule should be applied
     */
    matchesHostname(hostname: string): boolean;

    /**
     * Extract feeds from the URL and add them to the feedsMap.
     * @param context - The rule context with URL information
     * @param feedsMap - Map to add discovered feeds to
     */
    extractFeeds(context: RuleContext, feedsMap: FeedsMap): void;
}
