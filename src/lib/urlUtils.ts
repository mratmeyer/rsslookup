/**
 * Cleans a URL by stripping query parameters, fragment identifiers,
 * and any trailing slash from the path using regex replacements.
 * @param urlString - The input URL string.
 * @returns The cleaned URL string, or the original string if invalid.
 */
export function cleanURL(urlString: string): string {
  let cleaned = urlString.replace(/#.*$/, "");
  cleaned = cleaned.replace(/\?.*$/, "");
  cleaned = cleaned.replace(/\/$/, "");
  return cleaned;
}

/**
 * Normalizes URL param encoding to prevent TanStack Router redirect loops.
 * If the 'url' query param contains unencoded :// it needs to be properly encoded.
 * @param urlString - The full request URL string (e.g., "/?url=https://example.com")
 * @returns The normalized URL string if encoding changed, otherwise null.
 */
export function normalizeURLParamEncoding(urlString: string): string | null {
  if (!urlString || !urlString.includes("?")) {
    return null;
  }

  const [path, queryString] = urlString.split("?", 2);
  if (!queryString) {
    return null;
  }

  const params = new URLSearchParams(queryString);
  const urlValue = params.get("url");

  // Check if URL contains unencoded :// (meaning it needs encoding)
  if (!urlValue || !urlValue.includes("://")) {
    return null;
  }

  // Re-encode using URLSearchParams.toString() which properly encodes special characters
  const normalizedUrl = `${path}?${params.toString()}`;

  // Only return if the encoding actually changed
  if (normalizedUrl !== urlString) {
    return normalizedUrl;
  }

  return null;
}

/**
 * Handles URL shortcuts in the path (e.g., /https://example.com -> /?url=https://example.com)
 * @param pathname - The URL pathname to check
 * @returns A redirect response if the path matches, otherwise null.
 */
export function handleURLShortcut(pathname: string): Response | null {
  // Must start with /http to be a shortcut candidate
  if (!pathname || !pathname.toLowerCase().startsWith("/http")) {
    return null;
  }

  // Match /http:/... or /https:/... (handles normalization)
  const match = pathname.match(/^\/(https?):\/+(.*)/i);

  if (match) {
    const protocol = match[1];
    const rest = match[2];
    const targetUrl = `${protocol}://${rest}`;

    return new Response(null, {
      status: 302,
      headers: { Location: `/?url=${encodeURIComponent(targetUrl)}` },
    });
  }

  return null;
}
