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

export default function Home() {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    captchaRef.current.execute();
  };

  const handleTurnstileSuccess = useCallback((token) => {
    console.log("Turnstile verification successful, token received.");
    setToken(token);
  }, []);

  const handleTurnstileError = () => {
    console.error("Turnstile challenge failed to load or execute.");
    toast.error("Captcha challenge failed. Please try loading the page again.");
    setLoading(false);
  };

  const handleTurnstileExpire = () => {
    console.warn("Turnstile challenge expired.");
    toast.error("Captcha challenge expired. Please submit again.");
    setLoading(false);
  };

  useEffect(() => {
    if (token && url) {
      setResponse(null);

      const body = {
        cloudflareToken: token,
        url: url,
      };

      fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errData) => Promise.reject(errData)); // Try to parse error JSON
          }

          return response.json();
        })
        .then((data) => {
          setResponse(data);
        })
        .catch((error) => {
          console.error("API Fetch Error:", error);
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
    console.log("Turnstile widget loaded.");

    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get("url");

    if (urlParam) {
      if (
        captchaRef.current &&
        typeof captchaRef.current.execute === "function"
      ) {
        console.log(
          "Turnstile ready and URL param present, executing automatically...",
        );

        setResponse(null);
        setLoading(true);

        captchaRef.current.execute();
      } else {
        console.error(
          "Turnstile loaded, URL param found, but ref/execute invalid!",
        );
        setLoading(false);
      }
    }
  }, []);

  return (
    <div>
      <Toaster />
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
        <div className="bg-white shadow-md rounded-xl pt-6 pb-0 px-5 mt-4 mb-12">
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <input
                type="url"
                onChange={(e) => setUrl(e.target.value)}
                className="p-3 rounded-md border-solid border-2 border-gray-300 w-full"
                id="inputText"
                name="inputText"
                placeholder="Paste URL here..."
                value={url}
              ></input>
              <button
                className="bg-gradient-to-b to-orange-700 from-red-800 w-28 text-white text-md shadow-sm rounded-md font-semibold ml-2 hover:opacity-75 disabled:opacity-50 
             disabled:cursor-not-allowed"
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
          <div>
            {loading ? (
              <div className="flex justify-center items-center mt-12 mb-6 pb-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-100"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
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
                  <div className="pb-3">
                    {response.status == "200" ? (
                      <div>
                        <h2 className="text-2xl font-semibold mt-8 mb-4 leading-tight">
                          Results
                        </h2>
                        <div>
                          {response.result.map((feed) => (
                            <FeedResult key={feed} feed={feed} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <ErrorMessage message={response.message} />
                    )}
                  </div>
                ) : (
                  <div></div>
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
