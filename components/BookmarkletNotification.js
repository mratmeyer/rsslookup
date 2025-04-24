import { useState, useEffect } from "react";

export function BookmarkletBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("bookmarklet-notif-04-07-2025");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("bookmarklet-notif-04-07-2025", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-orange-50 text-orange-900 mb-8 shadow-sm rounded-lg p-4 flex justify-between items-center">
      <p className="text-sm leading-normal">
        RSS Lookup now has a bookmarklet! Drag this link into your bookmarks
        bar, and search RSS feeds on any site straight from your browser.{" "}
        <b>
          <a
            className="underline hover:opacity-75 text-orange-700 hover:text-orange-900"
            target="_blank"
            rel="noopener noreferrer"
            href="javascript:(function(){var currentUrl=window.location.href; var encodedUrl=encodeURIComponent(currentUrl); var targetUrl='https://www.rsslookup.com/?url='+encodedUrl; var newTab=window.open(targetUrl,'_blank'); if(newTab){newTab.focus();}else{alert('Please allow pop-ups for RSS Lookup bookmarklet.');}})();"
          >
            Find RSS Feeds
          </a>
        </b>
      </p>
      <button
        onClick={handleDismiss}
        className="ml-4 text-orange-600 hover:text-orange-800 text-lg font-bold"
        aria-label="Dismiss bookmarklet notification"
      >
        &times;
      </button>
    </div>
  );
}