// List of possible feed paths to scrape if feed not found directly
const POSSIBLE_FEED_PATHS = [
  // Absolute paths
  '/atom',
  '/atom.xml',
  '/feed',
  '/feed/',
  '/feed.rss',
  '/feed.xml',
  '/index.rss',
  '/index.xml',
  '/rss',
  '/rss/',
  '/rss.xml',

  // Relative paths
  'atom',
  'atom.xml',
  'feed',
  'feed/',
  'feed.rss',
  'feed.xml',
  'index.rss',
  'index.xml',
  'rss',
  'rss/',
  'rss.xml',
];

/**
 * Checks common feed paths relative to the base URL.
 * @param {string} baseUrl - The final URL of the page fetched.
 * @param {Map<string, string|null>} feedsMap - Map of feed URL -> title (null if title should be fetched).
 * @param {string} userAgent - The user agent string to use for requests.
 */
export async function checkCommonFeedPaths(baseUrl, feedsMap, userAgent) {
  const checkPromises = POSSIBLE_FEED_PATHS.map(async (path) => {
    let potentialFeedUrl;
    try {
      potentialFeedUrl = new URL(path, baseUrl).toString();

      if (feedsMap.has(potentialFeedUrl)) {
        return null;
      }

      const response = await fetch(potentialFeedUrl, {
        method: 'GET',
        headers: { 'User-Agent': userAgent },
        redirect: 'follow',
      });

      const contentType = response.headers.get('content-type') || '';
      if (
        (response.ok || response.status === 304) &&
        (contentType.includes('xml') ||
          contentType.includes('rss') ||
          contentType.includes('atom'))
      ) {
        return response.url;
      }

      return null;
    } catch (error) {
      return null;
    }
  });

  const results = await Promise.allSettled(checkPromises);

  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      feedsMap.set(result.value, null); // null = fetch title later
    }
  });
}

