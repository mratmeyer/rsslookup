export function EmptyState() {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-4 text-card-foreground dark:bg-white/[0.04]"
      role="status"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm dark:bg-white/[0.07]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m20 20-4-4" />
        </svg>
      </div>

      <div>
        <h2 className="font-semibold leading-6 text-foreground-heading">
          No RSS feeds found
        </h2>
        <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
          We couldn’t find a feed for this URL.
        </p>
      </div>
    </div>
  );
}
