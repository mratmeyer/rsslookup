import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { FeedResult as FeedResultType } from "~/lib/types";

interface FeedResultProps {
  feed: FeedResultType;
}

export function FeedResult({ feed }: FeedResultProps) {
  const { url, title } = feed;
  const [isCopied, setIsCopied] = useState(false);

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
      className="bg-white/90 dark:bg-card group flex items-center justify-between border border-border/50 p-5 rounded-3xl shadow-sm [@media(any-hover:hover)]:hover:border-border [@media(any-hover:hover)]:hover:shadow-md active:border-border active:shadow-md cursor-pointer transition duration-200 ease-in-out"
    >
      <div className="flex flex-col min-w-0 mr-4">
        {title && (
          <span className="text-muted-foreground text-xs font-bold mb-1 truncate">
            {title}
          </span>
        )}
        <span className="text-url-foreground text-base font-medium truncate font-mono bg-url px-3 py-1 rounded-full transition-colors duration-200">
          {url}
        </span>
      </div>
      <button
        className={`ml-2 flex-shrink-0 p-2 rounded-xl transition-all duration-300 relative w-9 h-9 flex items-center justify-center ${
          isCopied
            ? "bg-green-500/20"
            : "bg-secondary [@media(any-hover:hover)]:group-hover:bg-primary/20 group-active:bg-primary/20"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 stroke-muted-foreground [@media(any-hover:hover)]:group-hover:stroke-primary group-active:stroke-primary transition-all duration-200 ease-in-out absolute ${
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
  );
}
