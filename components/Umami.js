import Script from 'next/script';
import { useEffect, useState } from 'react';

const UmamiComponent = () => {
  const [hostUrl, setHostUrl] = useState('');

  useEffect(() => {
    // Set the host URL to current origin so Umami sends data to our proxy
    setHostUrl(window.location.origin);
  }, []);

  // Don't render until we have the host URL to avoid hydration mismatch
  if (!hostUrl) return null;

  return (
    <Script
      defer
      src="/api/script"
      data-website-id="a8f55736-8547-49f3-a40d-dc2845f232e9"
      data-host-url={hostUrl}
    />
  );
};

export default UmamiComponent;

// Export trackEvent for use in other components
export const trackEvent = (eventName) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName);
  }
};

