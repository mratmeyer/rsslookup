/**
 * TanStack Start configuration with global request middleware.
 * Handles URL shortcuts and normalization before routing.
 */

/// <reference types="@cloudflare/workers-types" />

import { createStart, createMiddleware } from "@tanstack/react-start";
import { handleURLShortcut, normalizeURLParamEncoding } from "./lib/urlUtils";
import { trackEvent } from "./lib/analytics";
import type { CloudflareEnv } from "./lib/types";

/**
 * Global request middleware that intercepts URL shortcuts and normalizes encoding.
 * Runs before every request (SSR, server routes, server functions).
 */
const urlMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);

  // Access Cloudflare env/ctx from globalThis (set by worker/index.ts in production)
  const env = (globalThis as any).process?.env as CloudflareEnv | undefined;
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
