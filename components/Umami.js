import Script from 'next/script';

const UmamiComponent = () => {
  return (
    <Script
      defer
      src="/api/script"
      data-website-id="a8f55736-8547-49f3-a40d-dc2845f232e9"
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

