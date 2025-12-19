/**
 * Cleans a URL using the URL API by removing query parameters,
 * fragment identifiers, and any trailing slash from the path.
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
 * Handles URL shortcuts in the path (e.g., /https://example.com -> /?url=https://example.com)
 * @param pathname - The URL pathname to check
 * @returns A redirect response if the path matches, otherwise null.
 */
export function handleURLShortcut(pathname: string): Response | null {
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
