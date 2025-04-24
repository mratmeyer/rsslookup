export function Intro(props) {
  return (
    <div>
      <div className="flex flex-row mb-6 items-center gap-3">
        <img
          src="/icons/rsslookup_128.jpg"
          alt="RSS Lookup Icon"
          className="inline rounded-lg shadow-sm"
          width="42"
          height="42"
        />
        <h1 className="text-4xl bg-gradient-to-b from-orange-600 to-orange-400 bg-clip-text text-transparent font-semibold">
          RSS Lookup
        </h1>
      </div>
      <h2 className="!leading-tight bg-gradient-to-b from-orange-600 to-red-700 bg-clip-text text-transparent text-4xl md:text-5xl font-semibold mb-6">
        A free, open-source tool to find RSS feeds on any URL
      </h2>
      <p className="text-lg text-slate-700 font-normal mb-8 leading-relaxed">
        Can't find the RSS feed for a website or blog? Paste the URL below and
        we'll try and find it!
      </p>
    </div>
  );
}