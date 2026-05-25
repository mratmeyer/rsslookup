import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import type { FeedResult as FeedResultType } from "~/lib/types";
import { trackUmamiEvent } from "~/lib/umami";
import { CommunityRuleIcon } from "./CommunityRuleIcon";

interface FeedResultProps {
  feed: FeedResultType;
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffDays / 365);
  if (diffYears === 1) return "1 year ago";
  return `${diffYears} years ago`;
}

function formatPreviewDate(isoDate: string): string {
  const absoluteDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));

  return `${absoluteDate} · ${formatRelativeDate(isoDate)}`;
}

export function FeedResult({ feed }: FeedResultProps) {
  const {
    url,
    title,
    description,
    isFromRule,
    itemCount,
    lastPostDate,
    postFrequency,
    posts,
  } = feed;
  const [isCopied, setIsCopied] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewPosts = posts ?? [];
  const hasPreviewPosts = previewPosts.length > 0;
  const cardHoverClasses = isPreviewHovered
    ? ""
    : "[@media(any-hover:hover)]:hover:border-border [@media(any-hover:hover)]:dark:hover:border-white/20 [@media(any-hover:hover)]:hover:shadow-md";
  const copyHoverClasses =
    isTooltipHovered || isPreviewHovered
      ? ""
      : "[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:bg-primary/15 [@media(hover:hover)_and_(pointer:fine)]:group-hover/copy:bg-primary/15";
  const copyIconHoverClasses =
    isTooltipHovered || isPreviewHovered
      ? ""
      : "[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:stroke-primary [@media(hover:hover)_and_(pointer:fine)]:group-hover/copy:stroke-primary";

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  useEffect(() => {
    if (!isPreviewOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPreviewOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleCopyButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    void handleCopy();
  };

  const handleCopyPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleCopyKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPreviewHovered(false);
    trackUmamiEvent("post-preview");
    setIsPreviewOpen(true);
  };

  const handlePreviewPointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
  };

  const handlePreviewKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      void handleCopy();
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        aria-label={`Copy feed URL ${url}`}
        className={`bg-white dark:bg-white/[0.055] group/card flex w-full flex-col items-stretch gap-3 border border-border dark:border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-[1.125rem] rounded-2xl shadow-sm text-left ${cardHoverClasses} active:border-border active:shadow-md cursor-pointer transition duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      >
        <div className="flex min-w-0 flex-col sm:mr-4">
          {title && (
            <span
              className="text-muted-foreground text-xs font-semibold mb-1.5 truncate"
              title={description || undefined}
            >
              {title}
            </span>
          )}
          <span className="text-url-foreground text-[15px] font-medium truncate font-mono bg-url dark:bg-zinc-700/90 px-3 py-1.5 rounded-xl transition-colors duration-200 self-start max-w-full">
            {url}
          </span>
          {(lastPostDate ||
            postFrequency ||
            (itemCount != null && itemCount > 0 && itemCount < 5)) && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {itemCount != null && itemCount > 0 && itemCount < 5 && (
                <span>
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              )}
              {itemCount != null &&
                itemCount > 0 &&
                itemCount < 5 &&
                lastPostDate && <span>·</span>}
              {lastPostDate && (
                <span>Last post {formatRelativeDate(lastPostDate)}</span>
              )}
              {lastPostDate && postFrequency && <span>·</span>}
              {postFrequency && <span>{postFrequency}</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 sm:ml-2 sm:gap-3">
          {isFromRule && (
            <CommunityRuleIcon onHoverChange={setIsTooltipHovered} />
          )}
          {hasPreviewPosts && (
            <button
              type="button"
              onClick={handlePreviewClick}
              onPointerDown={handlePreviewPointerDown}
              onKeyDown={handlePreviewKeyDown}
              onMouseEnter={() => setIsPreviewHovered(true)}
              onMouseLeave={() => setIsPreviewHovered(false)}
              aria-label={`Preview posts for ${title || url}`}
              className="group/preview relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary p-1.5 transition-all duration-200 dark:border-transparent dark:bg-white/10 sm:h-9 sm:w-9 sm:p-2 [@media(any-hover:hover)]:hover:bg-primary/15 active:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[18px] w-[18px] stroke-muted-foreground transition-colors duration-200 sm:h-5 sm:w-5 [@media(any-hover:hover)]:group-hover/preview:stroke-primary group-active/preview:stroke-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={handleCopyButtonClick}
            onPointerDown={handleCopyPointerDown}
            onKeyDown={handleCopyKeyDown}
            aria-label={`Copy feed URL ${url}`}
            className={`group/copy relative ml-auto flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border p-1.5 transition-colors duration-300 sm:ml-0 sm:h-9 sm:w-9 sm:p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 ${
              isCopied
                ? "border-transparent bg-green-500/20"
                : `border-border bg-secondary dark:border-transparent dark:bg-white/10 active:bg-primary/15 ${copyHoverClasses}`
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute h-[18px] w-[18px] stroke-muted-foreground transition-all duration-200 ease-in-out sm:h-5 sm:w-5 group-active/copy:stroke-primary ${copyIconHoverClasses} ${
                isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute h-[18px] w-[18px] stroke-green-500 transition-all duration-200 ease-in-out sm:h-5 sm:w-5 ${
                isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {isPreviewOpen &&
        hasPreviewPosts &&
        createPortal(
          <div
            role="presentation"
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-4 sm:items-center sm:py-6"
            onClick={() => setIsPreviewOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`feed-preview-${encodeURIComponent(url)}`}
              className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl dark:border-white/10 dark:bg-background sm:max-h-[min(720px,calc(100dvh-3rem))]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-border dark:border-white/10 p-5">
                <div className="min-w-0">
                  <h3
                    id={`feed-preview-${encodeURIComponent(url)}`}
                    className="text-base font-semibold text-foreground-heading"
                  >
                    Recent posts
                  </h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {title || url}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors dark:border-transparent dark:bg-white/10 [@media(any-hover:hover)]:hover:bg-primary/15 [@media(any-hover:hover)]:hover:text-primary active:bg-primary/15 active:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                  aria-label="Close preview"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-5 overscroll-contain">
                <div className="space-y-4">
                  {previewPosts.map((post, index) => (
                    <article
                      key={`${post.url || post.title || "post"}-${index}`}
                      className="border-b border-border/60 dark:border-white/10 pb-4 last:border-0 last:pb-0"
                    >
                      {post.url ? (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="line-clamp-2 text-sm font-semibold leading-6 text-foreground-heading transition-colors [@media(any-hover:hover)]:hover:text-primary"
                        >
                          {post.title || post.url}
                        </a>
                      ) : (
                        <h4 className="line-clamp-2 text-sm font-semibold leading-6 text-foreground-heading">
                          {post.title || "Untitled post"}
                        </h4>
                      )}
                      {post.publishedAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatPreviewDate(post.publishedAt)}
                        </p>
                      )}
                      {post.summary && (
                        <p className="line-clamp-2 mt-2 text-sm leading-6 text-muted-foreground">
                          {post.summary}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
