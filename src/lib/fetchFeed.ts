import { FETCH_TIMEOUT_MS } from "./constants";
import { validateUrl } from "./validateUrl";

export interface SafeFetchResult {
  response: Response;
  url: string;
}

/**
 * Builds standard fetch options for outbound requests.
 */
export function buildFetchOptions(userAgent: string): RequestInit {
  return {
    method: "GET",
    headers: { "User-Agent": userAgent },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  };
}

/**
 * Fetches a URL with standard options, post-redirect URL validation,
 * and status code checking. Returns null on any failure.
 */
export async function safeFetch(
  url: string,
  userAgent: string,
): Promise<SafeFetchResult | null> {
  try {
    const response = await fetch(url, buildFetchOptions(userAgent));

    if (!validateUrl(new URL(response.url)).valid) {
      return null;
    }

    if (!response.ok && response.status !== 304) {
      return null;
    }

    return { response, url: response.url };
  } catch {
    return null;
  }
}
