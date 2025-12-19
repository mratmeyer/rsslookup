export interface FeedResult {
  url: string;
  title: string | null;
}

export interface LookupResponse {
  status: number;
  result?: FeedResult[];
  message?: string;
}

export type FeedsMap = Map<string, string | null>;

/**
 * Cloudflare Worker Environment bindings
 */
export interface CloudflareEnv {
  ASSETS: Fetcher;
  CLOUDFLARE_TURNSTILE_SECRET?: string;
  [key: string]: unknown;
}
