export function RSSInfo() {
  return (
    <div className="mb-16 border-t border-border pt-12">
      <div className="bg-secondary/80 dark:bg-white/[0.02] rounded-3xl p-8 border border-border/50">
        <h2 className="text-3xl font-bold mb-6 leading-tight text-foreground-heading tracking-tight">
          What are RSS feeds?
        </h2>
        <div className="prose prose-lg prose-slate text-muted-foreground">
          <p className="mb-4 leading-relaxed">
            The web is filled with dynamic content that is always changing. RSS
            feeds were created decades ago to standardize the way we pull new
            content like articles and blog posts from across the internet.
          </p>
          <p className="leading-relaxed">
            There's not much you can do with an RSS feed URL on its own, but there
            are many RSS clients and services you can use to subscribe to them.
          </p>
        </div>
      </div>
    </div>
  );
}
