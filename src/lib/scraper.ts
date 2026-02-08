import { POSSIBLE_FEED_PATHS } from "./constants";
import type { FeedsMap } from "./types";

/**
 * Checks common feed paths relative to the base URL.
 * @param baseUrl - The final URL of the page fetched.
 * @param feedsMap - Map of feed URL -> title (null if title should be fetched).
 * @param userAgent - The user agent string to use for requests.
 * @returns Object containing found status and request count.
 */
export async function checkCommonFeedPaths(
  baseUrl: string,
  feedsMap: FeedsMap,
  userAgent: string,
): Promise<{ foundAny: boolean; requestCount: number }> {
  let requestCount = 0;
  const checkPromises = POSSIBLE_FEED_PATHS.map(async (path) => {
    let potentialFeedUrl: string;
    try {
      potentialFeedUrl = new URL(path, baseUrl).toString();

      if (feedsMap.has(potentialFeedUrl)) {
        return null;
      }

      // We are about to make a request
      requestCount++;

      const response = await fetch(potentialFeedUrl, {
        method: "GET",
        headers: { "User-Agent": userAgent },
        redirect: "follow",
      });

      const contentType = response.headers.get("content-type") || "";
      if (
        (response.ok || response.status === 304) &&
        (contentType.includes("xml") ||
          contentType.includes("rss") ||
          contentType.includes("atom"))
      ) {
        return response.url;
      }

      return null;
    } catch {
      return null;
    }
  });

  const results = await Promise.allSettled(checkPromises);
  let foundAny = false;

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      feedsMap.set(result.value, { title: null, isFromRule: false });
      foundAny = true;
    }
  });

  return { foundAny, requestCount };
}
