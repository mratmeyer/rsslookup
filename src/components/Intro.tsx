export function Intro() {
  return (
    <div className="mb-10">
      <div className="flex flex-row mb-8 items-center gap-4">
        <img
          src="/icons/rsslookup_128.jpg"
          alt="RSS Lookup Icon"
          className="inline rounded-2xl shadow-md"
          width={48}
          height={48}
        />
        <h1 className="text-3xl bg-gradient-to-r from-orange-700 to-orange-500 dark:from-orange-500 dark:to-orange-400 bg-clip-text text-transparent font-bold tracking-tight">
          RSS Lookup
        </h1>
      </div>
      <h2 className="!leading-tight text-foreground-heading text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
        A free, open-source tool to find RSS feeds on any URL
      </h2>
      <p className="text-xl text-muted-foreground font-normal mb-10 leading-relaxed max-w-2xl">
        Can't find the RSS feed for a website or blog? Paste the URL below and
        we'll try and find it!
      </p>
    </div>
  );
}
