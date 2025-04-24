// FILE: RSSInfo.js
export function RSSInfo(props) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-semibold mb-5 leading-tight">
        What are RSS feeds?
      </h2>
      <p className="text-l mb-4 leading-relaxed text-slate-700">
        The web is filled with dynamic content that is always changing. RSS
        feeds were created decades ago to standardize the way we pull new
        content like articles and blog posts from across the internet.
      </p>
      <p className="text-l leading-relaxed text-slate-700">
        There's not much you can do with an RSS feed URL on its own, but there
        are many RSS clients and services you can use.
      </p>
    </div>
  );
}