import Document, { Html, Head, Main, NextScript } from 'next/document'
import Link from 'next/link';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="/fonts/style.css" rel="stylesheet"/>
        </Head>
        <div className="bg-slate-100">
          <div className="m-auto max-w-3xl p-6 lg:p-12 min-h-screen">
            <body>
              <div className="mb-8">
                <Main />
                <NextScript />
              </div>
              <div className="text-center">
                <p className="font-bold">Made with <img src="/heart.png" alt="Heart Emoji" className="inline" width="20" height="20"></img> in Atlanta by <a className="underline hover:opacity-75" target="_blank" rel="noreferrer noopener" href="https://www.maxratmeyer.com/?utm_source=rsslookup">Max</a></p>
                <p className="font-bold">View source on <a className="underline hover:opacity-75" target="_blank" rel="noreferrer noopener" href="https://github.com/mratmeyer/rsslookup">GitHub</a></p>
              </div>

              <noscript>
                <img src="https://shynet.maxnet.work/ingress/0fc2782b-0a62-4417-ae0b-47023a3bc3eb/pixel.gif"></img>
              </noscript>
              <script defer src="https://shynet.maxnet.work/ingress/0fc2782b-0a62-4417-ae0b-47023a3bc3eb/script.js"></script>
            </body>
          </div>
        </div>
      </Html>
    )
  }
}

export default MyDocument
