import { checkCommonFeedPaths } from "./scraperUtils";
import { parseHtmlForFeeds, fetchFeedTitle } from "./parserUtils";
import { parseURLforRules } from "./ruleUtils";
import { USER_AGENT } from "./constants";
import { checkRateLimits } from "./rateLimitUtils";
import type { LookupResponse, FeedsMap, CloudflareEnv } from "./types";
import { trackEvent } from "./analytics";

/**
 * Look up RSS feeds for a given URL.
 * @param url - The URL to search for feeds.
 * @param ip - The IP address of the client (optional, for rate limiting).
 * @param env - The Cloudflare environment bindings (optional, for analytics).
 * @param source - The source of the request (optional, for analytics).
 * @param ctx - The Cloudflare ExecutionContext (optional, for waitUntil on analytics).
 * @returns The lookup response with feeds or error.
 */
export async function lookupFeeds(
  url: string,
  ip: string | null = null,
  env?: CloudflareEnv,
  source: string = "unknown",
  ctx?: ExecutionContext,
): Promise<LookupResponse> {
  const startTime = Date.now();
  let upstreamStatus = 0;
  let errorType = "none";
  let method: "rule" | "scrape" | "guess" | "none" = "none";

  let externalRequestCount = 0;

  // Helper to record analytics before returning
  const recordAnalytics = (
    status: "success" | "no_feeds" | "error" | "blocked",
    feedCount: number,
    finalErrorType: string = "none",
  ) => {
    if (env) {
      trackEvent(
        env,
        {
          eventName: "lookup",
          status,
          method,
          errorType: finalErrorType,
          source,
          feedCount,
          durationMs: Date.now() - startTime,
          upstreamStatus,
          externalRequestCount,
        },
        ctx,
      );
    }
  };

  // 1. INPUT VALIDATION
  if (!url) {
    recordAnalytics("error", 0, "missing_url");
    return { status: 400, message: "Missing 'url' field." };
  }

  let parsedURL: URL;
  try {
    // Basic validation: can it be parsed as a URL?
    parsedURL = new URL(url);
  } catch {
    recordAnalytics("error", 0, "invalid_url");
    return {
      status: 400,
      message: "Invalid URL format provided.",
    };
  }

  // 2. CHECK RATE LIMITS
  const rateLimitResult = await checkRateLimits(ip, url, env, source, ctx);
  if (!rateLimitResult.allowed) {
    // Analytics for rate limits are handled inside checkRateLimits for granularity,
    // but we record the lookup failure here too.
    recordAnalytics("blocked", 0, rateLimitResult.errorType || "rate_limit");
    return {
      status: 429,
      message: rateLimitResult.errorMessage || "Rate limit exceeded.",
    };
  }

  // Find feeds - Map of URL -> title (null if title needs to be fetched)
  const foundFeeds: FeedsMap = new Map();

  // Run rules initially to handle "salvage" cases where fetch might fail
  parseURLforRules(url, parsedURL.hostname, foundFeeds);
  if (foundFeeds.size > 0) method = "rule";

  let response: Response | undefined;
  let responseText: string | undefined;
  let finalUrl: string | undefined;

  // 4. FETCH URL CONTENT
  try {
    externalRequestCount++;
    const fetchOptions = {
      method: "GET",
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow" as const,
    };
    response = await fetch(url, fetchOptions);
    upstreamStatus = response.status;
    finalUrl = response.url; // Could be redirected

    if (!(response.ok || response.status === 304)) {
      if (foundFeeds.size === 0) {
        errorType = `http_${response.status}`;
        recordAnalytics("error", 0, errorType);
        return {
          status: 502,
          message: `Unable to access URL: Status ${response.status}`,
        };
      }
      // If we have feeds from rules, fall through
    } else {
      responseText = await response.text();
    }
  } catch (error) {
    errorType = "fetch_error";
    if (foundFeeds.size === 0) {
      recordAnalytics("error", 0, errorType);
      return {
        status: 502,
        message: `Error fetching URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  // 5. PARSE CONTENT AND FIND FEEDS
  // A. Parse HTML for <link> tags
  if (responseText && finalUrl) {
    if (parseHtmlForFeeds(responseText, finalUrl, foundFeeds)) {
      // Only update method if we didn't already have rules and found something here
      if (method === "none") method = "scrape";
    }
  }

  // B. Check Common Paths (if limited feeds found)
  // If no feeds found in HTML, check common paths
  if (foundFeeds.size === 0 && finalUrl) {
    const { foundAny, requestCount } = await checkCommonFeedPaths(
      finalUrl,
      foundFeeds,
      USER_AGENT,
    );
    externalRequestCount += requestCount;
    if (foundAny) {
      method = "guess";
    }
  }

  // Parse URL for hardcoded rules again (to catch YouTube playlists etc)
  parseURLforRules(url, parsedURL.hostname, foundFeeds);
  if (foundFeeds.size > 0 && method === "none") method = "rule";

  // Return final results
  if (foundFeeds.size === 0) {
    recordAnalytics("no_feeds", 0);
    return {
      status: 404,
      message: "No feeds found on this site.",
    };
  }

  // 6. RESOLVE FEEDS AND FETCH TITLES
  // Fetch titles only for feeds that don't have a hardcoded title
  const feedEntries = Array.from(foundFeeds.entries());

  // Count fetches for missing titles
  const titleFetchesNeeded = feedEntries.filter(
    ([_, meta]) => meta.title === null,
  ).length;
  externalRequestCount += titleFetchesNeeded;

  const titlePromises = feedEntries.map(([feedUrl, metadata]) =>
    metadata.title !== null
      ? Promise.resolve(metadata.title)
      : fetchFeedTitle(feedUrl, USER_AGENT),
  );
  const titles = await Promise.all(titlePromises);

  const resultData = feedEntries.map(([feedUrl, metadata], index) => ({
    url: feedUrl,
    title: titles[index],
    isFromRule: metadata.isFromRule,
  }));

  recordAnalytics("success", resultData.length);
  return {
    status: 200,
    result: resultData,
  };
}
