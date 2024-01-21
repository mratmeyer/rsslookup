import { errorResponse, successfulResponse, resultResponse } from './apiUtils.js'


const htmlparser2 = require("htmlparser2")


const possiblePaths = [
  "/feed/",
  "/rss/",
  "/feed.xml",
  "/index.xml"
]


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
    return errorResponse("Request must be POST or OPTIONS")
  }


  // Accept all OPTIONS requests
  if (request.method === 'OPTIONS') {
    return successfulResponse("Responding to preflight")
  }


  const requestJSON = await request.json().catch(SyntaxError)


  // Block if no hcaptcha token
  if (requestJSON.hcaptcha === undefined) {
    return errorResponse("No hcaptcha token!")
  }


  let hcaptchaStatus


  // Process hcaptcha
  await fetch('https://hcaptcha.com/siteverify?secret=' + HCAPTCHA_SECRET + '&response=' + requestJSON.hcaptcha)
  .then((response) => response.json()).then((response) => {
    hcaptchaStatus = response.success
  })
  .catch(error => {
    return errorResponse("Error verifying hcaptcha (" + error + ")")
  })

  if (hcaptchaStatus === false) {
    return errorResponse("Failed hcaptcha")
  }


  // Check if URL has been passed
  if (requestJSON.url === undefined) {
    return errorResponse("Must pass a URL tag in the JSON body!")
  }


  // Check if URL is empty
  if (requestJSON.url === "") {
    return errorResponse("Please input a URL")
  }


  // If error during fetch, return error
  const response = await fetch(requestJSON.url).catch(error => {
    return errorResponse("Error fetching URL (" + error + ")")
  })


  // If response not successful, return error
  if (response === undefined || !response.ok) {
    return errorResponse("We were unable to access this URL!")
  }

  const responseText = await response.text()

  const feeds = new Set()

  // Strip non-domain characters
  const url = response.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img)

  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      if (name === "link") {
        // Look for RSS link tags
        if (attributes.type === "application/rss+xml" || attributes.type === "application/atom+xml" || attributes.type === "application/rss&#re;xml") {
          let feedURL = attributes.href

          // If feed URL starts with /
          if (feedURL.charAt(0) == '/') {
            // If URL ends with /, remove it for consistency
            if (url.slice(-1) === '/') {
              feedURL = url.slice(0, -1) + feedURL
            } else {
              feedURL = url + feedURL
            }
          }

          // If URL isn't a valid URL, append domain
          if (feedURL.search(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/) === -1) {
            feedURL = url + "/" + feedURL
          }

          feeds.add(feedURL)
        }
      }
    },
  })

  parser.write(
    responseText
  )

  parser.end()


  // If no feeds have been found yet, check other possible paths
  for (path of possiblePaths) {
    if (feeds.size == 0) {
      const feedResponse = await fetch(url + path)
  
      if (feedResponse.status == 200) {
        feeds.add(feedResponse.url)
      }
    }
  }


  // If still no feeds, return error that no feeds found
  if (feeds.size == 0) {
    return errorResponse("Sorry, we couldn't find any RSS feeds on this site!")
  }

  const result = {
    "status": "200",
    "result": []
  }

  for (let feed of feeds) {
    result["result"].push(feed)
  }

  return resultResponse(result)
}
