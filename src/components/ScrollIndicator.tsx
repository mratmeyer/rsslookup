import { useEffect, useState } from "react";

interface ScrollIndicatorProps {
  visible: boolean;
}

export function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  const [delayElapsed, setDelayElapsed] = useState(false);

  useEffect(() => {
    if (!visible) {
      setDelayElapsed(false);
      return;
    }

    const timeoutId = setTimeout(() => setDelayElapsed(true), 1000);
    return () => clearTimeout(timeoutId);
  }, [visible]);

  return (
    <div
      className={`fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-500 pointer-events-none z-40 ${
        visible && delayElapsed ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-3 bg-background/60 backdrop-blur-sm px-5 py-2.5 rounded-full">
        <span className="text-xs text-muted-foreground/55 font-medium">
          More below
        </span>
        <svg
          className="w-5 h-5 translate-y-0.5 text-muted-foreground/60"
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
