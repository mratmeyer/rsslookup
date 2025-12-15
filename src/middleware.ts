import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "vinxi/http";

/**
 * Middleware to handle URL path redirects.
 * Converts /https://example.com or /http://example.com to /?url=https://example.com
 */
export const urlRedirectMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if path starts with /http:/ or /https:/
    // Note: browsers normalize // to / in paths, so /https://example.com becomes /https:/example.com
    if (pathname.startsWith("/http:/") || pathname.startsWith("/https:/")) {
      // Extract the URL (remove leading /) and restore the double slash
      const targetUrl = pathname.slice(1).replace(/^(https?:)\/?/, "$1//");

      // Build redirect URL
      const redirectUrl = new URL("/", url.origin);
      redirectUrl.searchParams.set("url", targetUrl);

      // Set 301 redirect status
      setResponseStatus(301);

      return new Response(null, {
        status: 301,
        headers: {
          Location: redirectUrl.toString(),
        },
      });
    }

    return next();
  }
);
