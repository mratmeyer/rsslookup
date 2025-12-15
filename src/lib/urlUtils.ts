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
