const faqs = [
  {
    question: "What does RSS Lookup do?",
    answer:
      "RSS Lookup is a free tool that finds the RSS feed associated with a website. Paste in any URL, and see if any feeds exist for that site!",
  },
  {
    question: "How does RSS Lookup work?",
    answer:
      "When you submit a URL, RSS Lookup fetches the site and looks for any RSS HTML tags. If it can't find any, it searches a couple common feed paths to make sure you find the feed if it exists.",
  },
  {
    question: "Why couldn't RSS Lookup find any feeds?",
    answer:
      "RSS Lookup looks for feeds if they exist, but unfortunately many websites do not have an RSS feed configured. In addition, some may have not properly configured their HTML RSS link tags.",
  },
  {
    question: "What information does this site collect?",
    answer:
      "This site is a side project I set up in a couple days- it's not meant to collect a bunch of data. Besides information Upstash Redis collects for rate limiting and anonymous analytics collected by Umami, I don't keep track of specific URLs requested using RSS Lookup.",
  },
];

export function FAQ() {
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-semibold mb-8 leading-tight text-foreground-heading">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-border/50 dark:divide-white/10 border-y border-border/50 dark:border-white/10">
        {faqs.map(({ question, answer }) => (
          <details key={question} className="faq-item group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold leading-tight text-foreground-heading transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm [&::-webkit-details-marker]:hidden">
              <h3>{question}</h3>
              <svg
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="pb-5 pr-9 text-lg leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
