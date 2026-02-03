import { useEffect, useState } from "react";

interface UseScrollArrowVisibilityOptions {
  targetElementId: string;
}

/**
 * Manages visibility of a scroll indicator arrow based on:
 * - IntersectionObserver for target element visibility
 * - Viewport height vs document height
 * - Presence of anchor links in URL
 */
export function useScrollArrowVisibility({
  targetElementId,
}: UseScrollArrowVisibilityOptions): boolean {
  const [showArrow, setShowArrow] = useState(true);

  // Hide arrow when target section becomes visible
  useEffect(() => {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowArrow(false);
        }
      },
      {
        threshold: 0.2,
        // Require element to be 200px into viewport before triggering
        rootMargin: "0px 0px -200px 0px",
      },
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [targetElementId]);

  // Hide arrow if viewport is tall enough to show all content
  useEffect(() => {
    const checkViewportHeight = () => {
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Only hide if content clearly fits with significant margin
      if (documentHeight <= viewportHeight - 100) {
        setShowArrow(false);
      }
    };

    // Delay check to ensure page is fully rendered
    const timeoutId = setTimeout(checkViewportHeight, 500);

    window.addEventListener("resize", checkViewportHeight);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkViewportHeight);
    };
  }, []);

  // Hide arrow if page loads with anchor link
  useEffect(() => {
    if (window.location.hash) {
      setShowArrow(false);
    }
  }, []);

  return showArrow;
}
