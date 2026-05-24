import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";

import { Intro } from "~/components/Intro";
import { ErrorMessage } from "~/components/ErrorMessage";
import { FeedResult } from "~/components/FeedResult";
import { RSSInfo } from "~/components/RSSInfo";
import { FAQ } from "~/components/FAQ";
import { ScrollReveal } from "~/components/ScrollReveal";
import { ScrollIndicator } from "~/components/ScrollIndicator";
import { URLInput } from "~/components/URLInput";
import { SearchButton } from "~/components/SearchButton";
import { APP_RESET_EVENT } from "~/lib/constants";
import {
  useFeedLookup,
  useScrollArrowVisibility,
  useKeyboardShortcut,
  usePlatformDetection,
} from "~/hooks";

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
  const [inputResetKey, setInputResetKey] = useState(0);
  const [scrollIndicatorDismissed, setScrollIndicatorDismissed] =
    useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { response, loading, execute, reset } = useFeedLookup({
    initialUrl: urlParam,
  });
  const showArrow = useScrollArrowVisibility({ targetElementId: "rss-info" });
  const { isMac } = usePlatformDetection();

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useKeyboardShortcut("k", focusInput, { meta: true, ctrl: true });

  useEffect(() => {
    setUrl((currentUrl) =>
      currentUrl !== (urlParam || "") ? urlParam || "" : currentUrl,
    );
  }, [urlParam]);

  useEffect(() => {
    const handleAppReset = () => {
      inputRef.current?.blur();
      setUrl("");
      setInputResetKey((key) => key + 1);
      setScrollIndicatorDismissed(false);
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener(APP_RESET_EVENT, handleAppReset);
    return () => {
      window.removeEventListener(APP_RESET_EVENT, handleAppReset);
    };
  }, [reset]);

  // Dismiss scroll indicator permanently when user interacts with input
  const handleInputFocusChange = useCallback((focused: boolean) => {
    if (focused) {
      setScrollIndicatorDismissed(true);
    }
  }, []);

  // Also dismiss if URL has content (e.g., from URL params or typing)
  useEffect(() => {
    if (url) {
      setScrollIndicatorDismissed(true);
    }
  }, [url]);

  // Hide the quiet scroll hint after any intentional page movement.
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        setScrollIndicatorDismissed(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await execute(url, "web");
  };

  return (
    <div>
      <div id="app">
        <div className="min-h-[calc(100vh-10rem)] sm:flex sm:flex-col sm:justify-start sm:pt-[5vh]">
          <Intro />
          <div className="mb-10 bg-secondary/70 dark:bg-white/[0.025] p-2 sm:p-2.5 rounded-[2rem] border border-border/70 dark:border-white/10 shadow-sm">
            <form onSubmit={handleSubmit} className="relative group/form">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <URLInput
                  key={inputResetKey}
                  value={url}
                  onChange={setUrl}
                  inputRef={inputRef}
                  isMac={isMac}
                  disabled={loading}
                  onFocusChange={handleInputFocusChange}
                />
                <SearchButton loading={loading} />
              </div>
            </form>
            {response != null && (
              <div className="mt-5 px-1 pb-1.5 sm:px-2">
                {response.status === 200 && response.result ? (
                  <div>
                    <h2 className="text-lg font-semibold mt-3 mb-4 leading-tight text-foreground-heading">
                      Found {response.result.length}{" "}
                      {response.result.length === 1 ? "Feed" : "Feeds"}
                    </h2>
                    <div className="space-y-3">
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
        </div>

        <ScrollIndicator
          visible={showArrow && !scrollIndicatorDismissed && !loading}
        />

        <div id="rss-info" className="mt-12">
          <ScrollReveal threshold={0.1}>
            <RSSInfo />
          </ScrollReveal>
        </div>

        <div id="faq">
          <ScrollReveal threshold={0.1} delay={100}>
            <FAQ />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
