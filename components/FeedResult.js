import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";

export function FeedResult(props) {
  return (
    <CopyToClipboard text={props.feed} onCopy={() => toast.success("Copied!")}>
      <div className="flex bg-gray-100 p-4 mb-2 rounded-md shadow-sm hover:opacity-75 cursor-pointer">
        <span className="text-slate-700">{props.feed}</span>
        <button className="ml-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 stroke-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </button>
      </div>
    </CopyToClipboard>
  );
}
