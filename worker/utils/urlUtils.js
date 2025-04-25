/**
 * Cleans a URL using the URL API by removing query parameters,
 * fragment identifiers, and any trailing slash from the path.
 * Placeholder - use the implementation from the previous example.
 * @param {string} urlString - The input URL string.
 * @returns {string} The cleaned URL string, or the original string if invalid.
 */
function cleanURL(urlString) {
    try {
        const url = new URL(urlString);
        let pathname = url.pathname;
        if (pathname.length > 1 && pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }
        return url.origin + pathname;
    } catch (e) {
        console.error(`Could not parse URL: ${urlString}. Error: ${e.message}`);
        let cleaned = urlString.replace(/#.*$/, '');
        cleaned = cleaned.replace(/\?.*$/, '');
        cleaned = cleaned.replace(/\/$/, '');
        return cleaned;
    }
}