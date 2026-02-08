/**
 * TanStack Start configuration with global request middleware.
 * Handles URL shortcuts and normalization before routing.
 */

/// <reference types="@cloudflare/workers-types" />

import { createStart, createMiddleware } from "@tanstack/react-start";
import { trackEvent } from "./lib/analytics";
import type { CloudflareEnv } from "./lib/types";

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

/**
 * Global request middleware that intercepts URL shortcuts and normalizes encoding.
 * Runs before every request (SSR, server routes, server functions).
 */
const urlMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);

  // Access Cloudflare env/ctx from globalThis (set by worker/index.ts in production)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (globalThis as any).process?.env as CloudflareEnv | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (globalThis as any).__cfCtx as ExecutionContext | undefined;

  // Handle URL shortcut redirects (e.g., /https://example.com -> /?url=...)
  const shortcut = handleURLShortcut(url.pathname);
  if (shortcut) {
    if (env) {
      trackEvent(
        env,
        {
          eventName: "redirect",
          status: "success",
          method: "none",
          errorType: "none",
          source: "shortcut",
          feedCount: 0,
          durationMs: 0,
          upstreamStatus: 302,
          externalRequestCount: 0,
        },
        ctx,
      );
    }
    return shortcut;
  }

  // Normalize URL param encoding to prevent TanStack Router redirect loops
  const normalizedUrl = normalizeURLParamEncoding(url.pathname + url.search);
  if (normalizedUrl) {
    return new Response(null, {
      status: 302,
      headers: { Location: normalizedUrl },
    });
  }

  // Continue to TanStack Router
  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [urlMiddleware],
}));
