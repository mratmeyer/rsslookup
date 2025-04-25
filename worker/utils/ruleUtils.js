/**
 * Parses URL for hardcoded rules.
 * @param {string} fullURL - The full URL path.
 * @param {string} hostname - The site hostname.
 * @param {Set<string>} feedsSet - The Set to add found feed URLs to.
 */
export function parseURLforRules(fullURL, hostname, feedsSet) {
  if (hostname == 'www.reddit.com') {
    let filter = fullURL.replace(/#.*$/, ''); // Remove fragment identifiers
    filter = filter.replace(/\?.*$/, ''); // Remove query parameters
    filter = filter.replace(/\/$/, ''); // Remove trailing slash
    feedsSet.add(filter + ".rss")
  }
}
