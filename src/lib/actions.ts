import { verifyCloudflare } from "./captchaUtils";
import { checkCommonFeedPaths } from "./scraperUtils";
import { parseHtmlForFeeds, fetchFeedTitle } from "./parserUtils";
import { parseURLforRules } from "./ruleUtils";
import { USER_AGENT } from "./constants";
import type { LookupResponse, FeedsMap } from "./types";

/**
 * Look up RSS feeds for a given URL.
 * @param url - The URL to search for feeds.
 * @param cloudflareToken - The Cloudflare Turnstile token for verification.
 * @param turnstileSecret - The Cloudflare Turnstile secret key.
 * @returns The lookup response with feeds or error.
 */
export async function lookupFeeds(
  url: string,
  cloudflareToken: string,
  turnstileSecret: string
): Promise<LookupResponse> {
  // Validate captcha token
  if (!cloudflareToken) {
    return {
      status: 400,
      message: "Cloudflare Turnstile token missing.",
    };
  }

  const isVerified = await verifyCloudflare(cloudflareToken, turnstileSecret);
  if (!isVerified) {
    return {
      status: 403,
      message: "Cloudflare Turnstile verification failed.",
    };
  }

  // Validate URL input
  if (!url) {
    return {
      status: 400,
      message: "Missing 'url' field.",
    };
  }

  let parsedURL: URL;
  try {
    // Basic validation: can it be parsed as a URL?
    parsedURL = new URL(url);
  } catch {
    return {
      status: 400,
      message: "Invalid URL format provided.",
    };
  }

  // Find feeds - Map of URL -> title (null if title needs to be fetched)
  const foundFeeds: FeedsMap = new Map();

  // Parse URL for hardcoded rules (these have pre-defined titles)
  parseURLforRules(url, parsedURL.hostname, foundFeeds);

  let response: Response | undefined;
  let responseText: string | undefined;
  let finalUrl: string | undefined;

  try {
    const fetchOptions = {
      method: "GET",
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow" as const,
    };
    response = await fetch(url, fetchOptions);
    finalUrl = response.url; // Could be redirected

    if (!(response.ok || response.status === 304 || foundFeeds.size > 0)) {
      return {
        status: 502,
        message: `Unable to access URL: Status ${response.status}`,
      };
    }
    responseText = await response.text();
  } catch (error) {
    if (foundFeeds.size === 0) {
      // If rules found matches, then ignore the fetch error
      return {
        status: 502,
        message: `Error fetching URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  // Parse HTML for <link> tags
  if (responseText && finalUrl) {
    parseHtmlForFeeds(responseText, finalUrl, foundFeeds);
  }

  // If no feeds found in HTML, check common paths
  if (foundFeeds.size === 0 && finalUrl) {
    await checkCommonFeedPaths(finalUrl, foundFeeds, USER_AGENT);
  }

  // Return final results
  if (foundFeeds.size === 0) {
    return {
      status: 404,
      message: "No feeds found on this site.",
    };
  }

  // Fetch titles only for feeds that don't have a hardcoded title
  const feedEntries = Array.from(foundFeeds.entries());
  const titlePromises = feedEntries.map(([feedUrl, existingTitle]) =>
    existingTitle !== null
      ? Promise.resolve(existingTitle)
      : fetchFeedTitle(feedUrl, USER_AGENT)
  );
  const titles = await Promise.all(titlePromises);

  const resultData = feedEntries.map(([feedUrl], index) => ({
    url: feedUrl,
    title: titles[index],
  }));

  return {
    status: 200,
    result: resultData,
  };
}
