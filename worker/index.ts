/**
 * Cloudflare Worker entry point for TanStack Start.
 * Handles URL redirects and env injection.
 */

/// <reference types="@cloudflare/workers-types" />

import { handleURLShortcut } from "../src/lib/urlUtils";
import type { CloudflareEnv } from "../src/lib/types";

export default {
  async fetch(
    request: Request,
    env: CloudflareEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const shortcut = handleURLShortcut(url.pathname);
    if (shortcut) return shortcut;

    // Import the bundled TanStack Start handler
    const { default: handler } = await import(
      "@tanstack/react-start/server-entry"
    );

    return (handler as any).fetch(request, env, ctx);
  },
};
