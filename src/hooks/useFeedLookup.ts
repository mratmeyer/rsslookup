import { useEffect, useRef, useState } from "react";
import { trackUmamiEvent } from "~/lib/umami";
import { lookupFeedsServerFn } from "~/lib/server-functions";
import type { LookupResponse } from "~/lib/types";

interface UseFeedLookupOptions {
  initialUrl?: string;
}

interface UseFeedLookupResult {
  response: LookupResponse | null;
  loading: boolean;
  execute: (url: string, source?: string) => Promise<void>;
}

/**
 * Handles feed lookup logic including:
 * - Manual execution via form submit
 * - Auto-execution for bookmarklet support
 * - Loading and response state management
 */
export function useFeedLookup({
  initialUrl,
}: UseFeedLookupOptions = {}): UseFeedLookupResult {
  const [response, setResponse] = useState<LookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const hasAutoExecutedRef = useRef(false);

  const execute = async (url: string, source: string = "web") => {
    if (!url) return;

    trackUmamiEvent(source === "bookmarklet" ? "bookmarklet" : "lookup");
    setLoading(true);
    setResponse(null);

    try {
      const data = await lookupFeedsServerFn({ data: { url, source } });
      setResponse(data as LookupResponse);
    } catch (error) {
      setResponse({
        status: 500,
        message:
          (error as { message?: string }).message ||
          "An error occurred while fetching data.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-execute lookup when URL param is provided (bookmarklet support)
  useEffect(() => {
    if (initialUrl && !hasAutoExecutedRef.current) {
      hasAutoExecutedRef.current = true;
      execute(initialUrl, "bookmarklet");
    }
  }, [initialUrl]);

  return { response, loading, execute };
}
