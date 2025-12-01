import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

export function FeedResult(props) {
  const { url, title } = props.feed;

  return (
    <CopyToClipboard text={url} onCopy={() => toast.success("Copied!")}>
      <div className="bg-card group flex items-center justify-between border border-border p-5 rounded-xl shadow-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 cursor-pointer transition duration-200 ease-in-out">
        <div className="flex flex-col min-w-0 mr-4">
          {title && (
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold mb-1 truncate">
              {title}
            </span>
          )}
          <span className="text-url-foreground text-base font-medium truncate font-mono bg-url px-2 py-1 rounded-md -ml-2 border border-transparent group-hover:border-border transition-colors duration-200">
            {url}
          </span>
        </div>
        <button className="ml-2 flex-shrink-0 p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 stroke-muted-foreground group-hover:stroke-primary transition duration-200 ease-in-out"
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
        </button>
      </div>
    </CopyToClipboard>
  );
}
