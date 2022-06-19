import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'

import { NextSeo } from 'next-seo';

import HCaptcha from '@hcaptcha/react-hcaptcha';

import { ErrorMessage } from '../components/ErrorMessage.js'
import { FAQ } from '../components/FAQ.js'
import { FeedCard } from '../components/FeedCard.js'
import { Intro } from '../components/Intro.js'

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
        <Intro />
        <form>
          <HCaptcha
            sitekey="634ade25-d644-4336-8d55-9c7218af99bb"
            onVerify={setToken}
            size="invisible"
            ref={captchaRef}
          />
          <div className="flex mt-4 mb-12">
            <input type="url" onChange={(e) => setUrl(e.target.value)} className="p-3 rounded-md w-full" id="inputText" name="inputText" placeholder="Paste URL here..." value={ url }></input>
            <button className="bg-white w-24 text-lg shadow-sm rounded-md font-semibold ml-2 hover:opacity-75" onClick={ handleSubmit } >Search</button>
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
        <FAQ />
      </div>
    </div>
  )
}
