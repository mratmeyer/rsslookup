import {
  errorResponse,
  optionsResponse,
  resultResponse,
} from './utils/apiUtils.js'
import { verifyHCaptcha } from './utils/captchaUtils.js'
import { parseHtmlForFeeds } from './utils/parserUtils.js'
import { checkCommonFeedPaths } from './utils/scraperUtils.js'

const USER_AGENT = 'RSSLookup/1.0.1 (https://github.com/mratmeyer/rsslookup)'

// Cloudflare Worker Entry Point
addEventListener('fetch', (event) => {
  event.respondWith(handleLookupRequest(event.request))
})

/**
 * Handles incoming requests to find feeds.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleLookupRequest(request) {
  // Handle OPTIONS (preflight) requests
  if (request.method === 'OPTIONS') {
    return optionsResponse()
  }

  // Ensure request method is POST
  if (request.method !== 'POST') {
    return errorResponse('Only POST requests are accepted.', 405)
  }

  try {
    // Parse JSON body
    let requestJSON
    try {
      requestJSON = await request.json()
    } catch (e) {
      return errorResponse('Invalid JSON body.', 400)
    }

    // Validate hCaptcha
    const hcaptchaToken = requestJSON.hcaptcha
    if (!hcaptchaToken) {
      return errorResponse('hCaptcha token missing.', 400)
    }
    const isVerified = await verifyHCaptcha(hcaptchaToken)
    if (!isVerified) {
      return errorResponse('hCaptcha verification failed.', 403)
    }

    // Validate URL input
    const targetUrl = requestJSON.url
    if (!targetUrl) {
      return errorResponse("Missing 'url' field in JSON body.", 400)
    }
    try {
      // Basic validation: can it be parsed as a URL?
      new URL(targetUrl)
    } catch (_) {
      return errorResponse('Invalid URL format provided.', 400)
    }

    // Fetch the target URL
    let response
    let responseText
    let finalUrl

    try {
      const fetchOptions = {
        method: 'GET',
        headers: { 'User-Agent': USER_AGENT },
        redirect: 'follow',
      }
      response = await fetch(targetUrl, fetchOptions)
      finalUrl = response.url // Could be redirected

      if (!(response.ok || response.status === 304)) {
        return errorResponse(
          `Unable to access URL: Status ${response.status}`,
          502,
        )
      }
      responseText = await response.text()
    } catch (error) {
      return errorResponse(`Error fetching URL: ${error.message}`, 502)
    }

    // Find feeds
    const foundFeeds = new Set()

    // Parse HTML for <link> tags
    parseHtmlForFeeds(responseText, finalUrl, foundFeeds)

    // If no feeds found in HTML, check common paths
    if (foundFeeds.size === 0) {
      await checkCommonFeedPaths(finalUrl, foundFeeds, USER_AGENT)
    }

    // Return final results
    if (foundFeeds.size === 0) {
      return errorResponse('No feeds found on this site.', 404)
    }

    const resultData = Array.from(foundFeeds)
    return resultResponse(resultData)
  } catch (error) {
    return errorResponse('An internal server error occurred.', 500)
  }
}
