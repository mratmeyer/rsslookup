export interface FeedResult {
  url: string;
  title: string | null;
  isFromRule?: boolean;
}

export interface LookupResponse {
  status: number;
  result?: FeedResult[];
  message?: string;
}

export interface FeedMetadata {
  title: string | null;
  isFromRule: boolean;
}

export type FeedsMap = Map<string, FeedMetadata>;

/**
 * Cloudflare Worker Environment bindings
 */
export interface CloudflareEnv {
  ASSETS: Fetcher;
  CLOUDFLARE_TURNSTILE_SECRET?: string;
  [key: string]: unknown;
}
