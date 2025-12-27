const COMMUNITY_RULES_URL =
  "https://github.com/mratmeyer/rsslookup?tab=readme-ov-file#adding-custom-site-rules";

interface CommunityRuleIconProps {
  onHoverChange?: (isHovering: boolean) => void;
}

export function CommunityRuleIcon({ onHoverChange }: CommunityRuleIconProps) {
  return (
    <div
      className="relative group/community flex-shrink-0"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 stroke-muted-foreground [@media(any-hover:hover)]:group-hover/community:stroke-primary transition-colors duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
      <div
        className="absolute right-0 sm:right-1/2 sm:translate-x-1/2 top-full pt-2 opacity-0 -translate-y-2 group-hover/community:opacity-100 group-hover/community:translate-y-0 transition-all duration-200 pointer-events-none group-hover/community:pointer-events-auto z-50 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-64 p-4 bg-card dark:bg-[#1A191E] border border-border dark:border-white/10 rounded-2xl shadow-xl text-xs leading-relaxed text-center text-muted-foreground">
          This feed was found by a community contributed rule.{" "}
          <a
            href={COMMUNITY_RULES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
}
