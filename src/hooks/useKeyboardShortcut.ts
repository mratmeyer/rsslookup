import { useEffect } from "react";

interface UseKeyboardShortcutOptions {
  meta?: boolean;
  ctrl?: boolean;
}

/**
 * Registers a keyboard shortcut handler.
 * @param key - The key to listen for
 * @param callback - Function to call when shortcut is triggered
 * @param options - Modifier key requirements (meta and/or ctrl)
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: UseKeyboardShortcutOptions,
): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const metaOrCtrl = options?.meta || options?.ctrl;
      if (metaOrCtrl && (e.metaKey || e.ctrlKey) && e.key === key) {
        e.preventDefault();
        callback();
      } else if (!metaOrCtrl && e.key === key) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, options?.meta, options?.ctrl]);
}
