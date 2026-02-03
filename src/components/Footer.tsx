export function Footer() {
  return (
    <div className="border-t border-border mt-12 pt-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
        <p>
          Made with{" "}
          <img
            src="/heart.png"
            alt="Heart Emoji"
            className="inline align-middle opacity-80"
            width="14"
            height="14"
          />{" "}
          in NYC by{" "}
          <a
            className="text-foreground hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://www.maxratmeyer.com/?utm_source=rsslookup"
          >
            Max
          </a>
        </p>

        <div className="flex items-center gap-6">
          <a
            className="hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/mratmeyer/rsslookup"
          >
            GitHub
          </a>
          <a
            className="hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://share.maxnet.work/rsslookup/terms.pdf"
          >
            Terms
          </a>
          <a
            className="hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://share.maxnet.work/rsslookup/privacy.pdf"
          >
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
}
