/// <reference types="@cloudflare/workers-types" />

import { handleURLShortcut, normalizeURLParamEncoding } from "./lib/urlUtils";
import { CloudflareEnv } from "./lib/types";
import { trackEvent } from "./lib/analytics";

/**
 * Shared middleware logic for the application.
 * Handles URL shortcuts and normalization in a platform-agnostic way.
 *
 * @param request - The incoming standard Web API Request.
 * @param env - The Cloudflare environment bindings (optional).
 * @param ctx - The Cloudflare ExecutionContext (optional, for waitUntil on analytics).
 * @returns A Response if interception is required (redirects), or null to proceed.
 */
export async function appMiddleware(request: Request, env?: CloudflareEnv, ctx?: ExecutionContext): Promise<Response | null> {
    const url = new URL(request.url);

    // Handle URL shortcut redirects (e.g., /https://example.com -> /?url=...)
    // We pass the pathname because handleURLShortcut expects that.
    const shortcut = handleURLShortcut(url.pathname);
    if (shortcut) {
        if (env) {
            trackEvent(env, {
                eventName: "redirect",
                status: "success",
                method: "none",
                errorType: "none",
                source: "shortcut",
                feedCount: 0,
                durationMs: 0,
                upstreamStatus: 302,
                externalRequestCount: 0,
            }, ctx);
        }
        return shortcut;
    }

    // Normalize URL param encoding to prevent TanStack Router redirect loops
    // We pass pathname + search because normalizeURLParamEncoding expects the full relative URL.
    const normalizedUrl = normalizeURLParamEncoding(url.pathname + url.search);
    if (normalizedUrl) {
        return new Response(null, {
            status: 302,
            headers: { Location: normalizedUrl },
        });
    }

    return null;
}
