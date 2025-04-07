import Head from "next/head";
import { useCallback, useEffect, useState, useRef } from "react";

import { NextSeo } from "next-seo";

import { Turnstile } from "@marsidev/react-turnstile";

import { ErrorMessage } from "../components/ErrorMessage.js";
import { RSSInfo } from "../components/RSSInfo.js";
import { FAQ } from "../components/FAQ.js";
import { FeedResult } from "../components/FeedResult.js";
import { Intro } from "../components/Intro.js";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    captchaRef.current.execute();
  };

  const handleTurnstileSuccess = useCallback((token) => {
    console.log("Turnstile verification successful, token received.");
    setToken(token);
  }, []);

  const handleTurnstileError = () => {
    console.error("Turnstile challenge failed to load or execute.");
    toast.error("Captcha challenge failed. Please try loading the page again.");
  };

  const handleTurnstileExpire = () => {
    console.warn("Turnstile challenge expired.");
    toast.error("Captcha challenge expired. Please submit again.");
  };

  useEffect(() => {
    if (token) {
      setResponse(null);
      setLoading(true);

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
          captchaRef.current?.reset()
        });
    }
  }, [token, url]);

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
        <Intro />
        <div className="bg-white shadow-md rounded-lg p-8 mt-4 mb-12">
          <form onSubmit={handleSubmit}>
            <Turnstile
              ref={captchaRef}
              siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
              onSuccess={handleTurnstileSuccess}
              onError={handleTurnstileError}
              onExpire={handleTurnstileExpire}
              options={{
                  execution: 'execute',
                  appearance: 'interaction-only'
              }}
            />
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
                className="bg-gray-200 w-24 text-lg shadow-sm rounded-md font-semibold ml-2 hover:opacity-75"
              >
                Search
              </button>
            </div>
          </form>
          <div>
            {loading ? (
              <div className="flex justify-center items-center mt-12">
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
                  <div>
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
