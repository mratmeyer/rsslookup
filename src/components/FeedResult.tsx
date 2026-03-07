import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { FeedResult as FeedResultType } from "~/lib/types";
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

export function FeedResult({ feed }: FeedResultProps) {
  const {
    url,
    title,
    description,
    isFromRule,
    itemCount,
    lastPostDate,
    postFrequency,
  } = feed;
  const [isCopied, setIsCopied] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="bg-white/90 dark:bg-white/5 group/card flex items-center justify-between border border-border/50 dark:border-white/10 p-5 rounded-3xl shadow-sm [@media(any-hover:hover)]:hover:border-border [@media(any-hover:hover)]:dark:hover:border-white/20 [@media(any-hover:hover)]:hover:shadow-md active:border-border active:shadow-md cursor-pointer transition duration-200 ease-in-out"
    >
      <div className="flex flex-col min-w-0 mr-4">
        {title && (
          <span
            className="text-muted-foreground text-xs font-bold mb-1 truncate"
            title={description || undefined}
          >
            {title}
          </span>
        )}
        <span className="text-url-foreground text-base font-medium truncate font-mono bg-url dark:bg-zinc-700 px-3 py-1 rounded-full transition-colors duration-200 self-start max-w-full">
          {url}
        </span>
        {(lastPostDate ||
          postFrequency ||
          (itemCount != null && itemCount > 0 && itemCount < 5)) && (
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
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
      <div className="flex items-center gap-3 ml-2">
        {isFromRule && (
          <CommunityRuleIcon onHoverChange={setIsTooltipHovered} />
        )}
        <button
          className={`flex-shrink-0 p-2 rounded-xl transition-all duration-300 relative w-9 h-9 flex items-center justify-center ${
            isCopied
              ? "bg-green-500/20"
              : `bg-secondary dark:bg-white/10 ${isTooltipHovered ? "" : "[@media(any-hover:hover)]:group-hover/card:bg-primary/20 group-active/card:bg-primary/20"}`
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 stroke-muted-foreground ${isTooltipHovered ? "" : "[@media(any-hover:hover)]:group-hover/card:stroke-primary group-active/card:stroke-primary"} transition-all duration-200 ease-in-out absolute ${
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
            className={`h-5 w-5 stroke-green-500 transition-all duration-200 ease-in-out absolute ${
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
  );
}
