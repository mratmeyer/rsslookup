import { useEffect } from 'react';
import Router from 'next/router';
import * as Fathom from 'fathom-client';

// Initialize Fathom with your site ID
const FATHOM_SITE_ID = 'JOFVIUUG';

// Track pageviews on route changes
Router.events.on('routeChangeComplete', (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

const FathomComponent = () => {
  // Load Fathom script when component mounts
  useEffect(() => {
    Fathom.load(FATHOM_SITE_ID, {
      // Add options here if needed
    });
  }, []);

  return null;
};

export default FathomComponent;

// Export trackEvent for use in other components
export const trackEvent = Fathom.trackEvent;