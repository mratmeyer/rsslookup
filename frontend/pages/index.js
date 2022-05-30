import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'

import { NextSeo } from 'next-seo';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function Home() {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) =>  {
    e.preventDefault();
    captchaRef.current.execute();
  }

  useEffect(() => {
    if (token) {
      setLoading(true);

      const body = {
        "hcaptcha": token,
        "url": url
      }

      fetch('https://api.rsslookup.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((response) => response.json())
        .then((data) => {
          setResponse(data);
          setLoading(false);
      });
    }
  }, [token]);

  return (
    <div>
      <NextSeo
        title="RSS Lookup - Get the RSS feed for any website"
        description="RSS Lookup is a free tool that lets you find the RSS feed for any website."
        canonical="https://www.rsslookup.com/"
      />
      <Head>
        <title>RSS Lookup - Get the RSS feed for any website</title>
      </Head>
      <div id="app">
        <h1 className="text-6xl font-semibold mb-8">RSS Lookup</h1>
        <h2 className="text-3xl font-semibold mb-8">A free tool to find the RSS feed for any website.</h2>
        <p className="text-xl mb-8">Can't find the RSS feed for a website or blog? Paste the URL below and we'll try and find it!</p>
        <form>
          <HCaptcha
            sitekey="634ade25-d644-4336-8d55-9c7218af99bb"
            onVerify={setToken}
            size="invisible"
            ref={captchaRef}
          />
          <div className="flex mt-4 mb-8">
            <input type="url" onChange={(e) => setUrl(e.target.value)} className="p-3 rounded-md w-full" id="inputText" name="inputText" placeholder="Paste URL here..." value={ url }></input>
            <button className="bg-white w-32 text-lg shadow-sm rounded-md font-bold ml-2 hover:opacity-75" onClick={ handleSubmit } >Find feed</button>
          </div>
        </form>
        <div className="mb-8">
          {loading 
            ? <div><p>Loading...</p></div>
            : <div>{response != null
              ? <div>
                { response.status == 200
                  ? <div>
                    {response.result.map((feed) => (
                      <div key={feed} className="flex bg-white p-4 mb-2 rounded-md shadow-sm">
                        <span className="text-slate-700">{feed}</span>
                        <CopyToClipboard text={feed} onCopy={() => alert("Copied!")}>
                          <button className="ml-1 hover:opacity-75">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </CopyToClipboard>
                      </div>
                    ))}
                  </div>
                  : <div className="bg-white rounded-md bg-red-300 p-3 px-4">
                    <span><b>Error:</b> {response.message}</span>
                  </div>
                }
                </div>
              : <div></div>
            }</div>
          }
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Frequently asked questions</h2>
          <div>
            <h3 className="text-2xl font-semibold mb-2">What does RSS Lookup do?</h3>
            <p className="text-xl mb-4">RSS Lookup is a free tool that finds the RSS feed associated with a website. When you use RSS Lookup, it fetches the site in the background and looks for the relevant RSS HTML tags. If it can't find the feed there, it searches a couple common feed paths to make sure you find the feed if it exists.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Why couldn't RSS Lookup find any feeds?</h3>
            <p className="text-xl mb-4">RSS Lookup looks for feeds if they exist, but unfortunately many websites do not have an RSS feed configured. In addition, some may have not properly configured their HTML RSS link tags. If you run into a site that RSS Lookup should have found, please let me know.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">What information does this site collect?</h3>
            <p className="text-xl mb-4">This site is a side project I set up in a couple days- it's not meant to collect a bunch of data. Besides my self-hosted analytics system for general site viewer data and information from Hcaptcha to prevent abuse, I don't keep track of site request data.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
