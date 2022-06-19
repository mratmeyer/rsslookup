const htmlparser2 = require("htmlparser2");

apiHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'content-type': 'application/json'
}

addEventListener('fetch', event => {
  event.respondWith(handleLookupRequest(event.request))
})

/**
 * Responds with lookup request
 * @param {Request} request
 */
async function handleLookupRequest(request) {
  // Block all non-POST or OPTIONS requests
  if (!(request.method === 'POST' || request.method === 'OPTIONS')) {
    console.log("Failed Request: Request must be POST or OPTIONS")
    return new Response(JSON.stringify(
      {
        "status": "500",
        "message": "Request must be POST or OPTIONS"
      }),
      {
        headers: apiHeaders,
        status: 500
      }
    )
  }

  // Accept all OPTIONS requests
  if (request.method === 'OPTIONS') {
    console.log("Successful Request: Responding to preflight")
    return new Response(JSON.stringify(
      {
        "status": "200",
        "message": "Responding to preflight"
      }),
      {
        headers: apiHeaders,
        status: 200
      }
    )
  }

  const requestJSON = await request.json().catch(SyntaxError)

  // Block if no hcaptcha token
  if (requestJSON.hcaptcha === undefined) {
    console.log("Failed Request: No hcaptcha token!")
    return new Response(JSON.stringify(
      {
        "status": "500",
        "message": "No hcaptcha token!"
      }),
      {
        headers: apiHeaders,
        status: 500
      }
    )
  }

  let hcaptchaStatus

  // Process hcaptcha
  await fetch('https://hcaptcha.com/siteverify?secret=' + HCAPTCHA_SECRET + '&response=' + requestJSON.hcaptcha)
  .then((response) => response.json()).then((response) => {
    hcaptchaStatus = response.success
  })
  .catch(error => {
    console.log("Error verifying hcaptcha (" + error + ")");
  })
  if (hcaptchaStatus === false) {
    console.log('Failed Request: Request failed captcha');
    return new Response(JSON.stringify(
      {
        "status": "500",
        "message": "Failed hcaptcha!"
      }),
      {
        headers: apiHeaders,
        status: 500
      }
    )
  }

  // Check if URL has been passed
  if (requestJSON.url === undefined) {
    console.log("Failed Request: Must pass in a URL JSON body tag!")
    return new Response(JSON.stringify(
      {
        "status": "500",
        "message": "Must pass a URL tag in the JSON body!"
      }),
      {
        headers: apiHeaders,
        status: 500
      }
    )
  }

  // Check if URL is empty
  if (requestJSON.url === "") {
    console.log("Failed Request: URL must be non-empty")
    return new Response(JSON.stringify(
      {
        "status": "500",
        "message": "Please input a URL to use RSS Lookup!"
      }),
      {
        headers: apiHeaders,
        status: 500
      }
    )
  }

  // If error during fetch, return error
  const response = await fetch(requestJSON.url).catch(error => {
    console.log("Error fetching URL (" + error + ")");
  })

  // If response not successful, return error
  if (response === undefined || !response.ok) {
    console.log("Failed Request: Invalid URL")
    return new Response(JSON.stringify(
      {
        "status": "500",
        "message": "We were unable to access this URL!"
      }),
      {
        headers: apiHeaders,
        status: 500
      }
    )
  }

  const responseText = await response.text()

  const feeds = new Set();

  // Strip non-domain characters
  const url = response.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img);

  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      if (name === "link") {
        // Look for RSS link tags
        if (attributes.type === "application/rss+xml" || attributes.type === "application/atom+xml" || attributes.type === "application/rss&#re;xml") {
          let feedURL = attributes.href;

          // If feed URL starts with /
          if (feedURL.charAt(0) == '/') {
            // If URL ends with /, remove it for consistency
            if (url.slice(-1) === '/') {
              feedURL = url.slice(0, -1) + feedURL;
            } else {
              feedURL = url + feedURL;
            }
          }

          // If URL isn't a valid URL, append domain
          if (feedURL.search(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/) === -1) {
            feedURL = url + "/" + feedURL;
          }

          feeds.add(feedURL);
        }
      }
    },
  });
  parser.write(
    responseText
  );
  parser.end();

  // If no feeds have been found yet, check /feed/
  if (feeds.size == 0) {
    const feedResponse = await fetch(url + '/feed/');

    if (feedResponse.status == 200) {
      feeds.add(feedResponse.url);
    }
  }

  // If no feeds have still been found yet, check /rss/
  if (feeds.size == 0) {
    const feedResponse = await fetch(url + '/rss/');

    if (feedResponse.status == 200) {
      feeds.add(feedResponse.url);
    }
  }

  // If still no feeds, return error that no feeds found
  if (feeds.size == 0) {
    console.log("Failed Request: Unable to find any feeds on site")
    return new Response(JSON.stringify(
      {
        "status": "500",
        "message": "Sorry, we couldn't find any RSS feeds on this site!"
      }),
      {
        headers: apiHeaders,
        status: 500
      }
    )
  }

  const result = {
    "status": "200",
    "result": []
  }

  for (let feed of feeds) {
    result["result"].push(feed);
  }

  console.log("Successful Request: Returned " + feeds.size + " result(s)")
  return new Response(JSON.stringify(result),
    {
      headers: apiHeaders,
      status: 200
    }
  )
}
