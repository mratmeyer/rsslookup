import { applyRules } from "./rules";
import type { FeedsMap } from "./types";

/**
 * Parses URL for hardcoded rules to find potential feed URLs.
 * @param fullURL - The full URL path.
 * @param hostname - The site hostname.
 * @param feedsMap - Map of feed URL -> title (null if title should be fetched).
 */
export function parseURLforRules(
  fullURL: string,
  hostname: string,
  feedsMap: FeedsMap
): void {
  applyRules(fullURL, hostname, feedsMap);
}
