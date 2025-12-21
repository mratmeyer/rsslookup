import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { toast } from "react-hot-toast";

import { BookmarkletBanner } from "~/components/BookmarkletNotification";
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
        <BookmarkletBanner />
        <Intro />
        <div className="mb-12">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <label htmlFor="inputText" className="sr-only">
                Enter URL to search
              </label>
              <input
                type="url"
                onChange={(e) => setUrl(e.target.value)}
                className="p-4 text-lg rounded-xl border border-input-border bg-input text-foreground w-full h-16 focus:border-ring focus:ring-4 focus:ring-ring/20 outline-none transition duration-200 ease-in-out shadow-sm"
                id="inputText"
                name="inputText"
                placeholder="Paste URL here..."
                value={url}
              />
              <button
                className="bg-primary hover:bg-primary-hover w-full sm:w-32 h-16 flex-shrink-0 text-primary-foreground text-lg shadow-md rounded-xl font-bold px-6 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                disabled={loading}
              >
                Search
              </button>
            </div>
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
          </form>
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center my-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-label="Loading"
                  role="status"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              <div>
                {response != null ? (
                  <div className="pb-6">
                    {response.status === 200 && response.result ? (
                      <div>
                        <h2 className="text-xl font-bold mt-8 mb-5 leading-tight text-foreground-heading">
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
                ) : (
                  <div className="h-1"></div>
                )}
              </div>
            )}
          </div>
        </div>
        <RSSInfo />
        <FAQ />
      </div>
    </div>
  );
}
