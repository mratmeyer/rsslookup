import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'

import { NextSeo } from 'next-seo';

import HCaptcha from '@hcaptcha/react-hcaptcha';

import { ErrorMessage } from '../components/ErrorMessage.js'
import { FeedCard } from '../components/FeedCard.js'

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
        <h1 className="text-6xl font-semibold mb-8 leading-tight">RSS Lookup</h1>
        <h2 className="text-3xl font-semibold mb-8 leading-tight">A free tool to find the RSS feed for any website.</h2>
        <p className="text-xl mb-8 leading-normal">Can't find the RSS feed for a website or blog? Paste the URL below and we'll try and find it!</p>
        <form>
          <HCaptcha
            sitekey="634ade25-d644-4336-8d55-9c7218af99bb"
            onVerify={setToken}
            size="invisible"
            ref={captchaRef}
          />
          <div className="flex mt-4 mb-8">
            <input type="url" onChange={(e) => setUrl(e.target.value)} className="p-3 rounded-md w-full" id="inputText" name="inputText" placeholder="Paste URL here..." value={ url }></input>
            <button className="bg-white w-24 text-lg shadow-md rounded-md font-semibold ml-2 hover:opacity-75" onClick={ handleSubmit } >Search</button>
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
                      <FeedCard key={ feed } feed={ feed } />
                    ))}
                  </div>
                  : <ErrorMessage message={ response.message } />
                }
                </div>
              : <div></div>
            }</div>
          }
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-4 leading-tight">Frequently asked questions</h2>
          <div>
            <h3 className="text-2xl font-semibold mb-2 leading-tight">What does RSS Lookup do?</h3>
            <p className="text-xl mb-4 leading-normal">RSS Lookup is a free tool that finds the RSS feed associated with a website. When you use RSS Lookup, it fetches the site in the background and looks for the relevant RSS HTML tags. If it can't find the feed there, it searches a couple common feed paths to make sure you find the feed if it exists.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2 leading-tight">Why couldn't RSS Lookup find any feeds?</h3>
            <p className="text-xl mb-4 leading-normal">RSS Lookup looks for feeds if they exist, but unfortunately many websites do not have an RSS feed configured. In addition, some may have not properly configured their HTML RSS link tags. If you run into a site that RSS Lookup should have found, please <a className="underline" href="mailto:max@rsslookup.com">let me know</a>.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2 leading-tight">What information does this site collect?</h3>
            <p className="text-xl mb-4 leading-normal">This site is a side project I set up in a couple days- it's not meant to collect a bunch of data. Besides my self-hosted analytics system for general site viewer data and information from Hcaptcha to prevent abuse, I don't keep track of specific URLs requested using RSS Lookup.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
