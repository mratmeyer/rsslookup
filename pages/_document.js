import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="/fonts/style.css" rel="stylesheet" />
        </Head>
        <body className="bg-background text-foreground">
          <div className="m-auto max-w-3xl p-6 lg:p-12 min-h-screen">
            <div className="mb-12">
              <Main />
              <NextScript />
            </div>

            <div className="text-center text-sm text-muted-foreground font-medium space-y-2 pb-8">
              <p>
                Made with{" "}
                {/* Using <img> instead of next/image as _document.js doesn't support the Image component */}
                <img
                  src="/heart.png"
                  alt="Heart Emoji"
                  className="inline align-middle opacity-80"
                  width="16"
                  height="16"
                />{" "}
                in Atlanta by{" "}
                <a
                  className="hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://www.maxratmeyer.com/?utm_source=rsslookup"
                >
                  Max
                </a>
              </p>
              <p>
                View source on{" "}
                <a
                  className="hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://github.com/mratmeyer/rsslookup"
                >
                  GitHub
                </a>
              </p>
              <p>
                <a
                  className="hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://share.maxnet.work/rsslookup/terms.pdf"
                >
                  Terms
                </a>
                <span className="mx-2">&middot;</span>
                <a
                  className="hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://share.maxnet.work/rsslookup/privacy.pdf"
                >
                  Privacy
                </a>
              </p>
            </div>
          </div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
