import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) =>  {
    setLoading(true);

    fetch('https://api.rssfinder.net').then((response) => response.json())
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
  }

  return (
    <div>
      <Head>
        <title>RSS Finder - Get the RSS feed for any webpage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="app">
        <h1 className="text-6xl font-semibold mb-8">RSS Feed Finder</h1>
        <p className="text-xl mb-8">Can't find the RSS feed for your favorite site? Paste the URL below and we'll try and find it.</p>
        <input type="text" onChange={(e) => setUrl(e.target.value)} className="shadow-md p-5 rounded-md w-full mb-4" id="inputText" name="inputText" placeholder="Paste URL here..." value={ url }></input>
        <button className="px-3 py-1 bg-white text-lg shadow-md rounded-lg font-bold" onClick={ handleSubmit } >Lets go</button>
        {loading 
          ? <div><p>Loading...</p></div>
          : <div>{response != null
            ? <p>data</p>
            : <p>no data</p>
          }</div>
        }
      </div>
    </div>
  )
}
