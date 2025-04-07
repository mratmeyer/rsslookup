// List of possible feed paths to scrape if feed not found directly
const POSSIBLE_FEED_PATHS = [
    // Absolute paths
    "/atom.xml",
    "/feed",
    "/feed/",
    "/feed.rss",
    "/feed.xml",
    "/index.rss",
    "/index.xml",
    "/rss",
    "/rss/",
    "/rss.xml",

    // Relative paths
    "atom.xml",
    "feed",
    "feed/",
    "feed.rss",
    "feed.xml",
    "index.rss",
    "index.xml",
    "rss",
    "rss/",
    "rss.xml"
];


/**
 * Checks common feed paths relative to the base URL.
 * @param {string} baseUrl - The final URL of the page fetched.
 * @param {Set<string>} feedsSet - The Set to add found feed URLs to.
 */
export async function checkCommonFeedPaths(baseUrl, feedsSet, userAgent) {
    const checkPromises = POSSIBLE_FEED_PATHS.map(async (path) => {
        let potentialFeedUrl;
        try {
            potentialFeedUrl = new URL(path, baseUrl).toString();

            if (feedsSet.has(potentialFeedUrl)) {
                return null;
            }

            const response = await fetch(potentialFeedUrl, {
                method: 'GET',
                headers: { 'User-Agent': userAgent },
                redirect: 'follow',
                cache: 'no-store'
            });

            const contentType = response.headers.get('content-type') || '';
            if (response.ok && (contentType.includes('xml') || contentType.includes('rss') || contentType.includes('atom'))) {
                return response.url;
            }

            return null;
        } catch (error) {
            return null;
        }
    });

    const results = await Promise.allSettled(checkPromises);

    results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            feedsSet.add(result.value);
        }
    });
}