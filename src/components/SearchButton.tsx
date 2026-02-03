interface SearchButtonProps {
  loading: boolean;
}

/**
 * Submit button with loading state and gradient animation.
 */
export function SearchButton({ loading }: SearchButtonProps) {
  return (
    <button
      className={`w-full sm:w-36 h-16 flex-shrink-0 bg-primary text-primary-foreground text-lg rounded-[1.75rem] font-semibold px-6 transition-all duration-200 ease-in-out disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2 shadow-md ${
        loading
          ? "loading-gradient loading-gradient-pulse"
          : "[@media(any-hover:hover)]:hover:bg-primary-hover active:bg-primary-hover"
      }`}
      disabled={loading}
    >
      {loading ? (
        <svg
          className="animate-spin h-6 w-6 text-white drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-30"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        "Search"
      )}
    </button>
  );
}
