import { handleURLShortcut, normalizeURLParamEncoding } from "./lib/urlUtils";

/**
 * Shared middleware logic for the application.
 * Handles URL shortcuts and normalization in a platform-agnostic way.
 * 
 * @param request - The incoming standard Web API Request.
 * @returns A Response if interception is required (redirects), or null to proceed.
 */
export async function appMiddleware(request: Request): Promise<Response | null> {
    const url = new URL(request.url);

    // Handle URL shortcut redirects (e.g., /https://example.com -> /?url=...)
    // We pass the pathname because handleURLShortcut expects that.
    const shortcut = handleURLShortcut(url.pathname);
    if (shortcut) return shortcut;

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
