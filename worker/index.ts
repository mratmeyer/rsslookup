/**
 * Cloudflare Worker entry point for TanStack Start.
 * Sets up Cloudflare env/ctx globals, then delegates to TanStack Start.
 * Appends security headers to all Worker-generated responses.
 */

/// <reference types="@cloudflare/workers-types" />

import type { CloudflareEnv } from "../src/lib/types";

/**
 * Security headers applied to all Worker-generated responses.
 * Static/prerendered assets are covered separately by public/_headers.
 */
const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.bunny.net; font-src 'self' https://fonts.bunny.net; connect-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "0",
};

export default {
  async fetch(
    request: Request,
    env: CloudflareEnv,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Polyfill process.env so it's available globally during the request
    // @ts-ignore
    globalThis.process = globalThis.process || {};
    // @ts-ignore
    globalThis.process.env = { ...globalThis.process.env, ...env };
    // Store ExecutionContext for server functions to use with waitUntil
    // @ts-ignore
    globalThis.__cfCtx = ctx;

    // Let TanStack Start handle everything
    const { default: handler } =
      await import("@tanstack/react-start/server-entry");

    const response: Response = await (handler as any).fetch(request, env, ctx);

    // Clone the response to append security headers
    const securedResponse = new Response(response.body, response);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      securedResponse.headers.set(key, value);
    }

    return securedResponse;
  },
};
