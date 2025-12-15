interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="bg-destructive border border-destructive-border text-destructive-foreground px-4 py-3 rounded-lg mt-8 flex items-center gap-3 shadow-sm"
      role="alert"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 stroke-destructive-icon flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>

      <span className="text-sm font-medium">
        <b className="font-semibold">Error:</b> {message}
      </span>
    </div>
  );
}
