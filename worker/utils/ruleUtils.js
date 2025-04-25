/**
 * Parses URL for hardcoded rules.
 * @param {string} fullURL - The full URL path.
 * @param {string} hostname - The site hostname.
 * @param {Set<string>} feedsSet - The Set to add found feed URLs to.
 */
export function parseURLforRules(fullURL, hostname, feedsSet) {
  if (hostname == 'reddit.com' || hostname == 'www.reddit.com') {
    feedsSet.add(fullURL + ".rss")
  }
}
