import Head from "next/head";
import { useCallback, useEffect, useState, useRef } from "react";

import { NextSeo } from "next-seo";

import { Turnstile } from "@marsidev/react-turnstile";

import { ErrorMessage } from "../components/ErrorMessage.js";
import { RSSInfo } from "../components/RSSInfo.js";
import { FAQ } from "../components/FAQ.js";
import { FeedResult } from "../components/FeedResult.js";
import { Intro } from "../components/Intro.js";
import { BookmarkletBanner } from "../components/BookmarkletNotification.js";
import { toast, Toaster } from "react-hot-toast";
import { trackEvent } from "../components/Umami.js";


export default function Home() {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    trackEvent('lookup');

    e.preventDefault();
    setLoading(true);
    captchaRef.current.execute();
  };

   const handleTurnstileSuccess = useCallback((token) => {
    setToken(token);
  }, []);

  const handleTurnstileError = () => {
    toast.error("Captcha challenge failed. Please try loading the page again.");
    setLoading(false);
  };

  const handleTurnstileExpire = () => {
    toast.error("Captcha challenge expired. Please submit again.");
    setLoading(false);
  };

  useEffect(() => {
    if (token && url) {
      setResponse(null);

      fetch("/api/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          cloudflareToken: token,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errData) => Promise.reject(errData));
          }
          return response.json();
        })
        .then((data) => {
          setResponse(data);
        })
        .catch((error) => {
          setResponse({
            status: "error",
            message: error.message || "An error occurred while fetching data.",
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
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlParam = searchParams.get("url");
      if (urlParam) {
        const decodedUrl = decodeURIComponent(urlParam);
        setUrl((currentUrl) =>
          currentUrl !== decodedUrl ? decodedUrl : currentUrl,
        );
      }
    }
  }, []);

  const handleTurnstileLoad = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get("url");

    if (urlParam) {
      trackEvent('bookmarklet');

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
  }, []);


  return (
    <div>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: 'rgb(var(--success))',
              color: 'rgb(var(--success-foreground))',
            },
          },
          error: {
             style: {
              background: 'rgb(var(--destructive))',
              color: 'rgb(var(--destructive-foreground))',
            },
          }
        }}
       />
      <NextSeo
        title="RSS Lookup - Find RSS feeds on any URL"
        description="RSS Lookup is a free, open-source tool that helps you search for RSS feeds on any URL"
        canonical="https://www.rsslookup.com/"
      />
      <Head>
        <title>RSS Lookup - Find RSS feeds on any URL</title>
      </Head>
      <div id="app">
        <BookmarkletBanner />
        <Intro />
        <div className="mb-12">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <label htmlFor="inputText" className="sr-only">Enter URL to search</label>
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
              siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
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
                    {response.status === 200 ? (
                      <div>
                        <h2 className="text-xl font-bold mt-8 mb-5 leading-tight text-foreground-heading">
                          Found {response.result.length} {response.result.length === 1 ? 'Feed' : 'Feeds'}
                        </h2>
                        <div className="space-y-4">
                          {response.result.map((feed) => (
                            <FeedResult key={feed.url} feed={feed} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <ErrorMessage message={response.message} />
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
