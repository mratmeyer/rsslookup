export function FAQ(props) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-semibold mb-8 leading-tight">
        Frequently asked questions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
        <div className="border-b border-slate-200 pb-6 sm:border-b-0 sm:pb-0">
          <h3 className="text-xl font-semibold mb-2 leading-tight">
            What does RSS Lookup do?
          </h3>
          <p className="text-l leading-relaxed text-slate-700">
            RSS Lookup is a free tool that finds the RSS feed associated with a
            website. Paste in any URL, and see if any feeds exist for that site!
          </p>
        </div>

        <div className="border-b border-slate-200 pb-6 sm:border-b-0 sm:pb-0">
          <h3 className="text-xl font-semibold mb-2 leading-tight">
            How does RSS Lookup work?
          </h3>
          <p className="text-l leading-relaxed text-slate-700">
            When you submit a URL, RSS Lookup fetches the site and looks for any RSS HTML tags. If it can't find
            any, it searches a couple common feed paths
            to make sure you find the feed if it exists.
          </p>
        </div>

        <div className="border-b border-slate-200 pb-6 sm:border-b-0 sm:pb-0">
          <h3 className="text-xl font-semibold mb-2 leading-tight">
            Why couldn't RSS Lookup find any feeds?
          </h3>
          <p className="text-l leading-relaxed text-slate-700">
            RSS Lookup looks for feeds if they exist, but unfortunately many
            websites do not have an RSS feed configured. In addition, some may
            have not properly configured their HTML RSS link tags.
          </p>
        </div>

        <div className="border-b border-slate-200 pb-6 last:border-b-0 sm:border-b-0 sm:pb-0">
          <h3 className="text-xl font-semibold mb-2 leading-tight">
            What information does this site collect?
          </h3>
          <p className="text-l leading-relaxed text-slate-700">
            This site is a side project I set up in a couple days- it's not meant
            to collect a bunch of data. Besides information Cloudflare Turnstile
            collects to prevent abuse and anonymous analytics collected by Plausible,
            I don't keep track of specific URLs requested using RSS Lookup.
          </p>
        </div>
      </div>
    </div>
  );
}