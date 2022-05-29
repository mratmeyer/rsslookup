import Head from 'next/head'
import { useState } from 'react'
import { NextSeo } from 'next-seo';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function Home() {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);

  const handleSubmit = (e) =>  {
    e.preventDefault();
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
      })
  }

  return (
    <div>
      <NextSeo
        title="RSS Lookup - Get the RSS feed for any webpage"
        description="RSS Lookup is a free tool to find the RSS feed for any website."
        canonical="https://www.rsslookup.com/"
      />
      <Head>
        <title>RSS Lookup - Get the RSS feed for any webpage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="app">
        <h1 className="text-6xl font-semibold mb-8">RSS Lookup</h1>
        <h2 className="text-3xl font-semibold mb-8">A free tool to find RSS feeds for any website.</h2>
        <p className="text-xl mb-4">Can't find the RSS feed for your favorite site? Paste the URL to the site below and we'll try and find it.</p>
        <form>
          <HCaptcha
            sitekey="634ade25-d644-4336-8d55-9c7218af99bb"
            onVerify={setToken}
          />
          <div className="flex mt-4 mb-8">
            <input type="url" onChange={(e) => setUrl(e.target.value)} className="p-3 rounded-md w-full" id="inputText" name="inputText" placeholder="Paste URL here..." value={ url }></input>
            <button className="bg-white w-32 text-lg shadow-md rounded-md font-bold ml-2" onClick={ handleSubmit } >Find feed</button>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-slate-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
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
            <p className="text-xl mb-4">RSS Lookup is a free tool that tries to find the RSS feed associated with a website. When using the tool, RSS Lookup fetches the site and looks for relevant RSS html tags as well as tries common feed paths if it can't find any.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Why couldn't RSS Lookup find any feeds?</h3>
            <p className="text-xl mb-4">RSS Lookup looks for feeds if they exist, but unfortunately many websites simply don't use RSS. In addition, some haven't properly configured their HTML(including the relevant RSS tags). If you run into a site that RSS Lookup should have worked on, please let me know.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Is there a public facing API?</h3>
            <p className="text-xl mb-4">Not right now. However, I'm not necessarily against it, so let me know if you would be interested.</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">What information does this site collect?</h3>
            <p className="text-xl mb-4">This site is a side project I set up in a couple days- it's not meant to collect data. Besides my self-hosted analytics system for general site viewer data, I don't keep track of which sites are requested or anything like that.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
