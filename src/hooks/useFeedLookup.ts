import { useCallback, useEffect, useRef, useState } from "react";
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
  reset: () => void;
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
  const requestIdRef = useRef(0);

  const execute = useCallback(async (url: string, source: string = "web") => {
    if (!url) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    trackUmamiEvent(source === "bookmarklet" ? "bookmarklet" : "lookup");
    setLoading(true);
    setResponse(null);

    try {
      const data = await lookupFeedsServerFn({ data: { url, source } });
      if (requestIdRef.current === requestId) {
        setResponse(data as LookupResponse);
      }
    } catch (error) {
      if (requestIdRef.current === requestId) {
        setResponse({
          status: 500,
          message:
            (error as { message?: string }).message ||
            "An error occurred while fetching data.",
        });
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    hasAutoExecutedRef.current = false;
    setResponse(null);
    setLoading(false);
  }, []);

  // Auto-execute lookup when URL param is provided (bookmarklet support)
  useEffect(() => {
    if (initialUrl && !hasAutoExecutedRef.current) {
      hasAutoExecutedRef.current = true;
      execute(initialUrl, "bookmarklet");
    }
  }, [execute, initialUrl]);

  return { response, loading, execute, reset };
}
