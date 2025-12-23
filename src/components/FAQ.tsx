export function FAQ() {
  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold mb-8 leading-tight text-foreground-heading tracking-tight">
        Frequently asked questions
      </h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
          <h3 className="text-lg font-bold leading-tight text-foreground-heading">
            What does RSS Lookup do?
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            RSS Lookup is a free tool that finds the RSS feed associated with a
            website. Paste in any URL, and see if any feeds exist for that site!
          </p>
        </div>

        <div className="border-t border-border/50 pt-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
          <h3 className="text-lg font-bold leading-tight text-foreground-heading">
            How does RSS Lookup work?
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            When you submit a URL, RSS Lookup fetches the site and looks for any
            RSS HTML tags. If it can't find any, it searches a couple common
            feed paths to make sure you find the feed if it exists.
          </p>
        </div>

        <div className="border-t border-border/50 pt-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
          <h3 className="text-lg font-bold leading-tight text-foreground-heading">
            Why couldn't RSS Lookup find any feeds?
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            RSS Lookup looks for feeds if they exist, but unfortunately many
            websites do not have an RSS feed configured. In addition, some may
            have not properly configured their HTML RSS link tags.
          </p>
        </div>

        <div className="border-t border-border/50 pt-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
          <h3 className="text-lg font-bold leading-tight text-foreground-heading">
            What information does this site collect?
          </h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            This site is a side project I set up in a couple days- it's not
            meant to collect a bunch of data. Besides information Cloudflare
            Turnstile collects to prevent abuse and anonymous analytics
            collected by Umami, I don't keep track of specific URLs
            requested using RSS Lookup.
          </p>
        </div>
      </div>
    </div>
  );
}
