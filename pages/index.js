import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'

import { NextSeo } from 'next-seo';

import HCaptcha from '@hcaptcha/react-hcaptcha';

import { ErrorMessage } from '../components/ErrorMessage.js'
import { RSSInfo } from '../components/RSSInfo.js'
import { FAQ } from '../components/FAQ.js'
import { FeedResult } from '../components/FeedResult.js'
import { Intro } from '../components/Intro.js'
import { FeedbackBanner } from '../components/FeedbackBanner.js'

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
        title="RSS Lookup - Find RSS feeds on any URL"
        description="RSS Lookup is a free, open-source tool that helps you search for RSS feeds on any URL"
        canonical="https://www.rsslookup.com/"
      />
      <Head>
        <title>RSS Lookup - Find RSS feeds on any URL</title>
      </Head>
      <div id="app">
        <FeedbackBanner />
        <Intro />
        <div className="bg-white shadow-md rounded-lg p-8 mt-4 mb-12">
          <form>
            <HCaptcha
              sitekey="634ade25-d644-4336-8d55-9c7218af99bb"
              onVerify={setToken}
              size="invisible"
              ref={captchaRef}
            />
            <div className="flex">
              <input type="url" onChange={(e) => setUrl(e.target.value)} className="p-3 rounded-md border-solid border-2 border-gray-300 w-full" id="inputText" name="inputText" placeholder="Paste URL here..." value={ url }></input>
              <button className="bg-gray-200 w-24 text-lg shadow-sm rounded-md font-semibold ml-2 hover:opacity-75" onClick={ handleSubmit } >Search</button>
            </div>
          </form>
          <div>
            {loading 
              ? <div><p className="mt-8">Loading...</p></div>
              : <div>{response != null
                ? <div>
                  { response.status == 200
                    ? <div>
                      <h2 className="text-2xl font-semibold mt-8 mb-4 leading-tight">Results</h2>
                      <div>
                        {response.result.map((feed) => (
                          <FeedResult key={ feed } feed={ feed } />
                        ))}
                      </div>
                    </div>
                    : <ErrorMessage message={ response.message } />
                  }
                  </div>
                : <div></div>
              }</div>
            }
          </div>
        </div>
        <RSSInfo />
        <FAQ />
      </div>
    </div>
  )
}
