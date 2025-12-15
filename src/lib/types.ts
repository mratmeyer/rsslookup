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
