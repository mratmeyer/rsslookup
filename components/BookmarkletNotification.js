import { useState, useEffect, useRef } from "react";

const BOOKMARKLET_CODE = "javascript:(function(){var currentUrl=window.location.href; var encodedUrl=encodeURIComponent(currentUrl); var targetUrl='https://www.rsslookup.com/?url='+encodedUrl; var newTab=window.open(targetUrl,'_blank','noreferrer'); if(newTab){newTab.focus();}else{alert('Please allow pop-ups for RSS Lookup bookmarklet.');}})();";

export function BookmarkletBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const linkRef = useRef(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("bookmarklet-notif-04-07-2025");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  // Set href dynamically to avoid React warning about javascript: URLs
  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.href = BOOKMARKLET_CODE;
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("bookmarklet-notif-04-07-2025", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-banner border border-banner-border text-banner-foreground mb-12 shadow-sm rounded-xl p-6 pr-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative">
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-2 text-banner-foreground">New! Bookmarklet</h3>
        <p className="text-base leading-relaxed text-banner-foreground/90">
          Drag the button below into your bookmarks bar to search RSS feeds on any site.
        </p>
      </div>
      <a
        ref={linkRef}
        className="inline-flex items-center justify-center bg-card border border-banner-border px-4 py-3 rounded-xl text-primary font-bold text-sm hover:bg-primary/10 hover:border-primary/50 hover:shadow-md transition-all duration-200 shadow-sm cursor-grab active:cursor-grabbing w-full sm:w-auto whitespace-nowrap"
        href="#"
        onClick={(e) => e.preventDefault()}
      >
        Find RSS Feeds
      </a>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-banner-foreground/50 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
        aria-label="Dismiss bookmarklet notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
