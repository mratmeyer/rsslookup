export function Intro(props) {
  return (
    <div>
      <h1 className="text-4xl text-slate-700 font-semibold mb-8">
        <img
          src="/magnifying-glass.png"
          alt="Magnifying Glass Emoji"
          className="inline mr-3"
          width="28"
          height="28"
        ></img>
        <span>RSS Lookup</span>
      </h1>
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
