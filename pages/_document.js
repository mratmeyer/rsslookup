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
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.bunny.net/css?family=inter:400,600,700" rel="stylesheet" />

            <script defer src="https://shynet.maxnet.work/ingress/9ab7c1c7-1244-433a-b723-b8e690e50d8c/script.js"></script>
        </Head>
        <div className="bg-gray-100">
          <div className="m-auto max-w-2xl p-6 lg:p-12 min-h-screen">
            <body>
              <div className="mb-8">
                <Main />
                <NextScript />
              </div>
              <div className="text-center">
                <p className="font-bold">Made with <img src="/heart.png" alt="Heart Emoji" className="inline" width="20" height="20"></img> in Athens, GA</p>
                <p className="font-bold">© Copyright <a className="underline hover:opacity-75" target="_blank" rel="noreferrer noopener" href="https://www.maxratmeyer.com/?utm_source=rsslookup">Max Ratmeyer</a> 2022</p>
                <p className="font-bold">View source on <a className="underline hover:opacity-75" target="_blank" rel="noreferrer noopener" href="https://github.com/mratmeyer/rsslookup">GitHub</a></p>
              </div>
            </body>
          </div>
        </div>
      </Html>
    )
  }
}

export default MyDocument
