import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { APP_RESET_EVENT } from "~/lib/constants";

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
    <nav className="flex items-center justify-between mb-10 py-5">
      <Link
        to="/"
        search={{}}
        onClick={() => window.dispatchEvent(new Event(APP_RESET_EVENT))}
        className="flex items-center gap-3 group/logo"
      >
        <img
          src="/icons/rsslookup_128.png"
          alt="RSS Lookup Icon"
          className="transition-transform duration-200 group-hover/logo:scale-105"
          width={30}
          height={30}
        />
        <span className="text-2xl font-semibold text-foreground">
          RSS Lookup
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com/mratmeyer/rsslookup"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source code on GitHub"
          className="group/github inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-secondary dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-muted-foreground transition-colors duration-200 group-hover/github:fill-primary"
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>

        <div className="hidden sm:block relative group/bookmarklet">
          <a
            ref={linkRef}
            href="#"
            onMouseDown={() => setText("Find RSS Feeds")}
            onMouseUp={() => setText("Bookmarklet")}
            onMouseLeave={() => setText("Bookmarklet")}
            onClick={(e) => e.preventDefault()}
            className="inline-flex h-10 items-center text-[13px] font-semibold text-muted-foreground hover:text-primary bg-slate-200/75 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-border/40 dark:border-white/10 px-4 rounded-full transition-all duration-200 cursor-grab active:cursor-grabbing shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {text}
          </a>
          <div className="absolute right-0 top-full mt-3 w-64 p-4 bg-card dark:bg-[#1A191E] border border-border dark:border-white/10 rounded-xl shadow-lg opacity-0 translate-y-2 group-hover/bookmarklet:opacity-100 group-hover/bookmarklet:translate-y-0 transition-all duration-200 pointer-events-none z-50 text-xs leading-relaxed text-center text-muted-foreground">
            Drag this to your bookmarks bar to use RSS Lookup on other sites
          </div>
        </div>
      </div>
    </nav>
  );
}
