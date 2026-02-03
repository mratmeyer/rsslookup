declare global {
  interface Window {
    umami?: {
      track: (eventName: string) => void;
    };
  }
}

/**
 * Track a custom event in Umami analytics.
 * @param eventName - The name of the event to track.
 */
export function trackEvent(eventName: string): void {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(eventName);
  }
}
