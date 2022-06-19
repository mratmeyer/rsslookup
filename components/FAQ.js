export function FAQ(props) {
    return <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-4 leading-tight">Frequently asked questions</h2>
        <div>
            <h3 className="text-2xl font-semibold mb-2 leading-tight">What does RSS Lookup do?</h3>
            <p className="text-xl mb-4 leading-normal">RSS Lookup is a free tool that finds the RSS feed associated with a website. When you use RSS Lookup, it fetches the site in the background and looks for the relevant RSS HTML tags. If it can't find the feed there, it searches a couple common feed paths to make sure you find the feed if it exists.</p>
        </div>
        <div>
            <h3 className="text-2xl font-semibold mb-2 leading-tight">Why couldn't RSS Lookup find any feeds?</h3>
            <p className="text-xl mb-4 leading-normal">RSS Lookup looks for feeds if they exist, but unfortunately many websites do not have an RSS feed configured. In addition, some may have not properly configured their HTML RSS link tags. If you run into a site that RSS Lookup should have found, please <a className="underline" href="mailto:max@rsslookup.com">let me know</a>.</p>
        </div>
        <div>
            <h3 className="text-2xl font-semibold mb-2 leading-tight">What information does this site collect?</h3>
            <p className="text-xl mb-4 leading-normal">This site is a side project I set up in a couple days- it's not meant to collect a bunch of data. Besides my self-hosted analytics system for general site viewer data and information from Hcaptcha to prevent abuse, I don't keep track of specific URLs requested using RSS Lookup.</p>
        </div>
    </div>
}
