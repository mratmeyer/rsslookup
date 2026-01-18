interface ScrollIndicatorProps {
  visible: boolean;
}

export function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  return (
    <div
      className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 pointer-events-none z-40 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-2 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full">
        <span className="text-sm text-muted-foreground/70 font-medium">
          Scroll for more
        </span>
        <svg
          className="w-6 h-6 text-muted-foreground/70 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
