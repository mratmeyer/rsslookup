import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  threshold?: number;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  threshold = 0.1,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after reveal for performance
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        // Start animation slightly before element enters viewport
        rootMargin: "0px 0px -100px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Build delay class if delay is provided
  const delayClass = delay > 0 ? `scroll-reveal-delay-${delay}` : "";

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? "is-visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
