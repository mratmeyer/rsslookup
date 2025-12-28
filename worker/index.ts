/**
 * Cloudflare Worker entry point for TanStack Start.
 * Handles URL redirects and env injection.
 */

/// <reference types="@cloudflare/workers-types" />

import { appMiddleware } from "../src/middleware";
import type { CloudflareEnv } from "../src/lib/types";

export default {
  async fetch(
    request: Request,
    env: CloudflareEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Polyfill process.env so it's available globally during the request
    // @ts-ignore
    globalThis.process = globalThis.process || {};
    // @ts-ignore
    globalThis.process.env = { ...globalThis.process.env, ...env };
    // Store ExecutionContext for server functions to use with waitUntil
    // @ts-ignore
    globalThis.__cfCtx = ctx;

    const response = await appMiddleware(request, env, ctx);
    if (response) return response;

    // Import the bundled TanStack Start handler
    const { default: handler } = await import(
      "@tanstack/react-start/server-entry"
    );

    return (handler as any).fetch(request, env, ctx);
  },
};
