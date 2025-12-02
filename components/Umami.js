import Script from 'next/script';

/**
 * Umami analytics script component.
 * Use as default import for the script tag, use named import for trackEvent.
 */
const UmamiComponent = () => {
  return (
    <Script
      defer
      src="/u/script.js"
      data-website-id="a8f55736-8547-49f3-a40d-dc2845f232e9"
      data-host-url="/u"
    />
  );
};

export default UmamiComponent;

/**
 * Track a custom event in Umami analytics.
 * @param {string} eventName - The name of the event to track.
 */
export function trackEvent(eventName) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName);
  }
}

