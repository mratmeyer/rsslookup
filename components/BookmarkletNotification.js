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
    <div className="bg-slate-200 mb-8 shadow-md rounded-lg p-5 flex justify-between items-center">
      <p className="text-s leading-normal">
        RSS Lookup now has a bookmarklet! Drag this link into your bookmarks
        bar, and search RSS feeds on any site straight from your browser.{" "}
        <b>
          <a
            className="underline hover:opacity-75"
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
        className="ml-4 text-gray-500 hover:text-gray-700 text-sm"
      >
        ✕
      </button>
    </div>
  );
}
