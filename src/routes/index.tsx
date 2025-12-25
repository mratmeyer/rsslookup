import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { toast } from "react-hot-toast";

import { Intro } from "~/components/Intro";
import { ErrorMessage } from "~/components/ErrorMessage";
import { FeedResult } from "~/components/FeedResult";
import { RSSInfo } from "~/components/RSSInfo";
import { FAQ } from "~/components/FAQ";
import { trackEvent } from "~/components/Umami";
import { lookupFeedsServerFn } from "~/lib/server-functions";
import { config } from "~/lib/config";
import type { LookupResponse } from "~/lib/types";

// Turnstile site key - from config
const TURNSTILE_SITE_KEY = config.turnstile.siteKey;

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    // Pass through search params as-is to prevent router normalization loops
    return search as { url?: string };
  },

  head: () => ({
    meta: [
      { title: "RSS Lookup - Find RSS feeds on any URL" },
      {
        property: "og:title",
        content: "RSS Lookup - Find RSS feeds on any URL",
      },
      {
        property: "og:description",
        content:
          "RSS Lookup is a free, open-source tool that helps you search for RSS feeds on any URL",
      },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://www.rsslookup.com/" }],
  }),

  component: HomePage,
});

function HomePage() {
  const { url: urlParam } = Route.useSearch();
  const [url, setUrl] = useState(urlParam || "");
  const [response, setResponse] = useState<LookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const captchaRef = useRef<TurnstileInstance>(null);
  const isPastingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Prefill logic: if typing into an empty field and it's not a paste
    if (!url && newValue && !isPastingRef.current) {
      // Check if it doesn't already have a protocol
      if (!newValue.match(/^https?:\/\//i)) {
        newValue = `https://${newValue}`;
      }
    }

    setUrl(newValue);
    // Reset pasting flag on next tick to ensure it covers the current change
    setTimeout(() => {
      isPastingRef.current = false;
    }, 0);
  };

  const handlePaste = () => {
    isPastingRef.current = true;
  };

  const handleScroll = () => {
    if (inputRef.current && mirrorRef.current) {
      mirrorRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const renderValueWithColors = (val: string) => {
    const protocolMatch = val.match(/^(https?:\/\/)(.*)/i);
    if (protocolMatch) {
      return (
        <>
          <span className="text-muted-foreground/50">{protocolMatch[1]}</span>
          <span>{protocolMatch[2]}</span>
        </>
      );
    }
    return val;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    trackEvent("lookup");

    e.preventDefault();
    setLoading(true);
    captchaRef.current?.execute();
  };

  const handleTurnstileSuccess = useCallback((token: string) => {
    setToken(token);
  }, []);

  const handleTurnstileError = () => {
    toast.error(
      "Captcha challenge failed. Please try loading the page again."
    );
    setLoading(false);
  };

  const handleTurnstileExpire = () => {
    toast.error("Captcha challenge expired. Please submit again.");
    setLoading(false);
  };

  useEffect(() => {
    if (token && url) {
      setResponse(null);

      lookupFeedsServerFn({ data: { url, cloudflareToken: token } })
        .then((data) => {
          setResponse(data as LookupResponse);
        })
        .catch((error) => {
          setResponse({
            status: 500,
            message:
              (error as { message?: string }).message ||
              "An error occurred while fetching data.",
          });
        })
        .finally(() => {
          setLoading(false);
          setToken(null);
          captchaRef.current?.reset();
        });
    }
  }, [token, url]);

  useEffect(() => {
    if (urlParam) {
      setUrl((currentUrl) =>
        currentUrl !== urlParam ? urlParam : currentUrl
      );
    }
  }, [urlParam]);

  const hasAutoExecutedRef = useRef(false);

  useEffect(() => {
    // Reset auto-execution flag when urlParam changes to a new value
    if (urlParam) {
      hasAutoExecutedRef.current = false;
    }
  }, [urlParam]);

  const handleTurnstileLoad = useCallback(() => {
    if (urlParam && !hasAutoExecutedRef.current) {
      hasAutoExecutedRef.current = true;
      trackEvent("bookmarklet");

      if (
        captchaRef.current &&
        typeof captchaRef.current.execute === "function"
      ) {
        setResponse(null);
        setLoading(true);

        captchaRef.current.execute();
      } else {
        setLoading(false);
      }
    }
  }, [urlParam]);

  return (
    <div>
      <div id="app">
        <Intro />
        <div className="mb-12 bg-secondary/80 dark:bg-white/[0.02] p-2 sm:p-3 rounded-[2.5rem] border border-border/50">
          <form onSubmit={handleSubmit} className="relative group/form">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-grow">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none group-focus-within/form:text-primary/50 transition-colors duration-200 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div
                  ref={mirrorRef}
                  className="absolute inset-0 pl-12 pr-4 py-4 text-lg w-full h-16 whitespace-pre overflow-hidden pointer-events-none flex items-center border border-transparent bg-transparent"
                  aria-hidden="true"
                >
                  {renderValueWithColors(url)}
                </div>
                <label htmlFor="inputText" className="sr-only">
                  Enter URL to search
                </label>
                <input
                  ref={inputRef}
                  type="url"
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  onScroll={handleScroll}
                  className={`pl-12 pr-4 py-4 text-lg rounded-[1.75rem] border border-input-border bg-input w-full h-16 focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-[border-color,box-shadow] duration-200 ease-in-out shadow-sm placeholder:text-muted-foreground/50 caret-foreground ${
                    url ? "text-transparent" : "text-foreground"
                  }`}
                  id="inputText"
                  name="inputText"
                  placeholder="Paste URL here..."
                  value={url}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <button
                className={`w-full sm:w-36 h-16 flex-shrink-0 bg-primary text-primary-foreground text-lg rounded-[1.75rem] font-bold px-6 transition-all duration-200 ease-in-out disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 tracking-tight shadow-md ${
                  loading
                    ? "loading-gradient loading-gradient-pulse"
                    : "[@media(any-hover:hover)]:hover:bg-primary-hover active:bg-primary-hover"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-6 w-6 text-white drop-shadow-md"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-30"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Search"
                )}
              </button>
            </div>
            <div className="absolute top-full left-0 w-full flex justify-center mt-4 z-50">
              <Turnstile
                ref={captchaRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={handleTurnstileSuccess}
                onError={handleTurnstileError}
                onExpire={handleTurnstileExpire}
                onWidgetLoad={handleTurnstileLoad}
                options={{
                  execution: "execute",
                  appearance: "interaction-only",
                }}
              />
            </div>
          </form>
          {response != null && (
            <div className="mt-6 px-1 pb-2">
              {response.status === 200 && response.result ? (
                <div>
                  <h2 className="text-xl font-bold mt-4 mb-5 leading-tight text-foreground-heading tracking-tight">
                    Found {response.result.length}{" "}
                    {response.result.length === 1 ? "Feed" : "Feeds"}
                  </h2>
                  <div className="space-y-4">
                    {response.result.map((feed) => (
                      <FeedResult key={feed.url} feed={feed} />
                    ))}
                  </div>
                </div>
              ) : (
                <ErrorMessage message={response.message || "Unknown error"} />
              )}
            </div>
          )}
        </div>
        <RSSInfo />
        <FAQ />
      </div>
    </div>
  );
}
