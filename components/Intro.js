export function Intro(props) {
  return (
    <div>
      <div className="flex flex-row mb-8 gap-3">
        <img
          src="/icons/rsslookup_128.jpg"
          alt="RSS Lookup Icon"
          className="inline rounded-lg shadow-sm"
          width="42"
          height="42"
        ></img>
        <h1 className="text-4xl bg-gradient-to-b from-orange-600 to-orange-400 bg-clip-text text-transparent font-semibold pt-[2px]">
          RSS Lookup
        </h1>
      </div>
      <h2 className="!leading-hero bg-gradient-to-b from-orange-600 to-red-700 bg-clip-text text-transparent text-5xl md:text-6xl font-semibold mb-8">
        A free, open-source tool to find RSS feeds on any URL
      </h2>
      <p className="text-xl text-slate-800 font-semibold mb-8 leading-normal">
        Can't find the RSS feed for a website or blog? Paste the URL below and
        we'll try and find it!
      </p>
    </div>
  );
}
