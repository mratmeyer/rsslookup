import { verifyCloudflare } from './captchaUtils.js';
import { checkCommonFeedPaths } from './scraperUtils.js';
import { parseHtmlForFeeds, fetchFeedTitle } from './parserUtils.js';
import { parseURLforRules } from './ruleUtils.js';
import { USER_AGENT } from './constants.js';

/**
 * Look up RSS feeds for a given URL.
 * @param {string} url - The URL to search for feeds.
 * @param {string} cloudflareToken - The Cloudflare Turnstile token for verification.
 * @returns {Promise<{status: number, result?: {url: string, title: string|null}[], message?: string}>}
 */
export async function lookupFeeds(url, cloudflareToken) {
  // Validate captcha token
  if (!cloudflareToken) {
    return {
      status: 400,
      message: 'Cloudflare Turnstile token missing.',
    };
  }

  const isVerified = await verifyCloudflare(cloudflareToken);
  if (!isVerified) {
    return {
      status: 403,
      message: 'Cloudflare Turnstile verification failed.',
    };
  }

  // Validate URL input
  if (!url) {
    return {
      status: 400,
      message: "Missing 'url' field.",
    };
  }

  let parsedURL;
  try {
    // Basic validation: can it be parsed as a URL?
    parsedURL = new URL(url);
  } catch {
    return {
      status: 400,
      message: 'Invalid URL format provided.',
    };
  }

  // Find feeds - Map of URL -> title (null if title needs to be fetched)
  const foundFeeds = new Map();

  let response;
  let responseText;
  let finalUrl;

  try {
    const fetchOptions = {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
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
        message: `Error fetching URL: ${error.message}`,
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

  // Parse URL for hardcoded rules (these have pre-defined titles)
  parseURLforRules(url, parsedURL.hostname, foundFeeds);

  // Return final results
  if (foundFeeds.size === 0) {
    return {
      status: 404,
      message: 'No feeds found on this site.',
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

