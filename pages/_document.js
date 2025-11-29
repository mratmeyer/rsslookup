import Document, { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

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
        <body className="bg-slate-50 text-slate-800">
          <div className="m-auto max-w-3xl p-6 lg:p-12 min-h-screen border-t-2 border-orange-500">
            <div className="mb-12">
              <Main />
              <NextScript />
            </div>

            <div className="text-center text-sm text-slate-600 font-medium">
              <p className="mb-1">
                Made with{" "}
                <img
                  src="/heart.png"
                  alt="Heart Emoji"
                  className="inline align-middle"
                  width="18"
                  height="18"
                ></img>{" "}
                in Atlanta by{" "}
                <a
                  className="underline hover:text-orange-600 transition duration-150 ease-in-out"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://www.maxratmeyer.com/?utm_source=rsslookup"
                >
                  Max
                </a>
              </p>
              <p className="mb-1">
                View source on{" "}
                <a
                  className="underline hover:text-orange-600 transition duration-150 ease-in-out"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://github.com/mratmeyer/rsslookup"
                >
                  GitHub
                </a>
              </p>
              <p>
                <a
                  className="underline hover:text-orange-600 transition duration-150 ease-in-out"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://share.maxnet.work/rsslookup/terms.pdf"
                >
                  Terms
                </a>
                &nbsp;
                <a
                  className="underline hover:text-orange-600 transition duration-150 ease-in-out"
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
