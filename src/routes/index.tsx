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
  const inputRef = useRef<HTMLInputElement>(null);

  const { response, loading, execute } = useFeedLookup({
    initialUrl: urlParam,
  });
  const showArrow = useScrollArrowVisibility({ targetElementId: "rss-info" });
  const { isMac } = usePlatformDetection();

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useKeyboardShortcut("k", focusInput, { meta: true, ctrl: true });

  useEffect(() => {
    if (urlParam) {
      setUrl((currentUrl) => (currentUrl !== urlParam ? urlParam : currentUrl));
    }
  }, [urlParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await execute(url, "web");
  };

  return (
    <div>
      <div id="app">
        <div className="min-h-[calc(100vh-12rem)] sm:flex sm:flex-col sm:justify-start sm:pt-[8vh]">
          <Intro />
          <div className="mb-12 bg-secondary/80 dark:bg-white/[0.02] p-2 sm:p-3 rounded-[2.5rem] border border-border/50">
            <form onSubmit={handleSubmit} className="relative group/form">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <URLInput
                  value={url}
                  onChange={setUrl}
                  inputRef={inputRef}
                  isMac={isMac}
                />
                <SearchButton loading={loading} />
              </div>
            </form>
            {response != null && (
              <div className="mt-6 px-1 pb-2">
                {response.status === 200 && response.result ? (
                  <div>
                    <h2 className="text-xl font-semibold mt-4 mb-5 leading-tight text-foreground-heading">
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
        </div>

        <ScrollIndicator visible={showArrow && !url} />

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
