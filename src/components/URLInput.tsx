import { useRef, useState } from "react";

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isMac: boolean | null;
  onFocusChange?: (focused: boolean) => void;
}

/**
 * URL input field with syntax highlighting for the protocol portion.
 * Includes auto-prefix of https:// when typing (not pasting).
 */
export function URLInput({
  value,
  onChange,
  inputRef,
  isMac,
  onFocusChange,
}: URLInputProps) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isPastingRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Prefill logic: if typing into an empty field and it's not a paste
    if (!value && newValue && !isPastingRef.current) {
      // Check if it doesn't already have a protocol
      if (!newValue.match(/^https?:\/\//i)) {
        newValue = `https://${newValue}`;
      }
    }

    onChange(newValue);
    // Reset pasting flag on next tick to ensure it covers the current change
    setTimeout(() => {
      isPastingRef.current = false;
    }, 0);
  };

  const handlePaste = () => {
    isPastingRef.current = true;
  };

  const handleScroll = () => {
    if (inputRef.current && mirrorRef.current) {
      mirrorRef.current.scrollLeft = inputRef.current.scrollLeft;
    }
  };

  const renderValueWithColors = (val: string) => {
    const protocolMatch = val.match(/^(https?:\/\/)(.*)/i);
    if (protocolMatch) {
      return (
        <>
          <span className="text-muted-foreground/50">{protocolMatch[1]}</span>
          <span>{protocolMatch[2]}</span>
        </>
      );
    }
    return val;
  };

  return (
    <div className="relative flex-grow">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none group-focus-within/form:text-primary/50 transition-colors duration-200 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <div
        ref={mirrorRef}
        className="absolute inset-0 pl-12 pr-4 sm:pr-16 py-4 text-lg w-full h-16 whitespace-pre overflow-hidden pointer-events-none flex items-center border border-transparent bg-transparent tracking-[0.015em]"
        aria-hidden="true"
      >
        {renderValueWithColors(value)}
      </div>
      <label htmlFor="inputText" className="sr-only">
        Enter URL to search
      </label>
      <input
        ref={inputRef}
        type="url"
        onChange={handleInputChange}
        onPaste={handlePaste}
        onScroll={handleScroll}
        onFocus={() => {
          setIsFocused(true);
          onFocusChange?.(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          onFocusChange?.(false);
        }}
        className={`pl-12 pr-4 sm:pr-16 py-4 text-lg rounded-[1.75rem] border border-input-border bg-input dark:bg-zinc-800 w-full h-16 focus:border-ring focus:ring-2 focus:ring-ring/20 outline-none transition-[border-color,box-shadow] duration-200 ease-in-out shadow-sm placeholder:text-muted-foreground/50 caret-foreground tracking-[0.015em] ${
          value ? "text-transparent" : "text-foreground"
        }`}
        id="inputText"
        name="inputText"
        placeholder="Paste URL here..."
        value={value}
        autoComplete="off"
        spellCheck="false"
      />
      {/* Keyboard shortcut indicator */}
      <div
        className={`absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center pointer-events-none transition-opacity duration-200 ${isMac === null || isFocused || value ? "opacity-0" : "opacity-100"}`}
      >
        <kbd className="px-1.5 py-0.5 text-xs font-medium text-muted-foreground/60 bg-secondary dark:bg-zinc-700 rounded border border-border/50">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </div>
    </div>
  );
}
