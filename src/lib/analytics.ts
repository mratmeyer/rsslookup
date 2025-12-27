import type { CloudflareEnv } from "./types";

/**
 * Analytics Event Definition
 */
export interface AnalyticsEvent {
    // Blobs (Strings)
    eventName: "lookup" | "rate_limit" | "redirect";
    status: "success" | "no_feeds" | "error" | "blocked" | "ok";
    method: "rule" | "scrape" | "guess" | "none";
    errorType: string;
    source: string;

    // Doubles (Numbers)
    feedCount: number;
    durationMs: number;
    upstreamStatus: number;
    externalRequestCount: number;
}

/**
 * Track an event to Cloudflare Analytics Engine
 */
export function trackEvent(env: CloudflareEnv, event: AnalyticsEvent) {
    if (!env.ANALYTICS) {
        // Analytics binding not available (e.g. during local dev without --mode wrangler)
        // console.log("[Analytics]", event);
        return;
    }

    try {
        env.ANALYTICS.writeDataPoint({
            blobs: [
                event.eventName,
                event.status,
                event.method,
                event.errorType,
                event.source,
            ],
            doubles: [
                event.feedCount,
                event.durationMs,
                event.upstreamStatus,
                event.externalRequestCount
            ],
            indexes: [event.eventName.slice(0, 32)], // Index by event name for faster filtering
        });
    } catch (error) {
        console.error("Failed to write analytics data point", error);
    }
}
