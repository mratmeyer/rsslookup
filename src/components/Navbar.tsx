import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

const BOOKMARKLET_CODE =
  "javascript:(function(){var currentUrl=window.location.href; var encodedUrl=encodeURIComponent(currentUrl); var targetUrl='https://www.rsslookup.com/?url='+encodedUrl; window.open(targetUrl,'_blank','noreferrer');})();";

export function Navbar() {
  const [text, setText] = useState("Bookmarklet");
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Set href dynamically to avoid React warning about javascript: URLs
  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.href = BOOKMARKLET_CODE;
    }
  }, []);

  return (
    <nav className="flex items-center justify-between mb-12 py-6">
      <Link to="/" className="flex items-center gap-3 group/logo">
        <img
          src="/icons/rsslookup_128.jpg"
          alt="RSS Lookup Icon"
          className="rounded-xl shadow-sm group-hover/logo:shadow-md transition-shadow duration-200"
          width={32}
          height={32}
        />
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-700 to-orange-500 dark:from-orange-500 dark:to-orange-400 bg-clip-text text-transparent">
          RSS Lookup
        </span>
      </Link>

      <div className="relative group/bookmarklet">
        <a
          ref={linkRef}
          href="#"
          onMouseDown={() => setText("Find RSS Feeds")}
          onMouseUp={() => setText("Bookmarklet")}
          onMouseLeave={() => setText("Bookmarklet")}
          onClick={(e) => e.preventDefault()}
          className="text-[13px] font-bold tracking-tight text-muted-foreground hover:text-primary bg-slate-200/80 dark:bg-secondary hover:bg-slate-200 dark:hover:bg-secondary/80 border border-transparent hover:border-border/50 px-4 py-2 rounded-full transition-all duration-200 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md active:shadow-none"
        >
          {text}
        </a>
        <div className="absolute right-0 top-full mt-3 w-64 p-4 bg-card border border-border rounded-2xl shadow-xl opacity-0 translate-y-2 group-hover/bookmarklet:opacity-100 group-hover/bookmarklet:translate-y-0 transition-all duration-200 pointer-events-none z-50 text-xs leading-relaxed text-center text-muted-foreground">
          Drag this to your bookmark bar to use RSS Lookup on other sites
        </div>
      </div>
    </nav>
  );
}

