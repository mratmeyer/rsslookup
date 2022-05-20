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
            <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700&display=swap" rel="stylesheet" />

            <script defer src="https://shynet.maxnet.work/ingress/9aa3b827-a913-4be4-bb90-4d8dca05f744/script.js"></script>
        </Head>
        <div className="">
          <div className="m-auto max-w-2xl p-12 min-h-screen">
            <body>
              <div className="mb-8">
                <Main />
                <NextScript />
              </div>
              <div className="text-center">
              <p className="font-bold">Made with ❤️ in Athens, GA</p>
                <p className="font-bold">© Copyright <a target="_blank" rel="noreferrer noopener" href="https://www.maxratmeyer.com/?utm_source=studyguideapp-com">Max Ratmeyer</a> 2022</p>
                <Link href="/terms-of-service">
                  <a className="font-bold underline">Terms of Service</a>
                </Link>
                <span className="font-bold"> and </span>
                <Link href="/privacy-policy">
                  <a className="font-bold underline">Privacy Policy</a>
                </Link>
              </div>
            </body>
          </div>
        </div>
      </Html>
    )
  }
}

export default MyDocument