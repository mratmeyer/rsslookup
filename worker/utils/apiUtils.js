const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.rsslookup.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'content-type': 'application/json',
}

/**
 * Creates an error response.
 * @param {string} message - The error message.
 * @param {number} [status=400] - The HTTP response status code
 * @returns {Response}
 */
export function errorResponse(message, status = 400) {
  return new Response(
    JSON.stringify({
      status: status.toString(),
      message: message,
    }),
    {
      headers: corsHeaders,
      status: status,
    },
  )
}

/**
 * Creates a successful response for OPTIONS preflight requests.
 * @returns {Response}
 */
export function optionsResponse() {
  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  })
}

/**
 * Creates a successful response containing the result data.
 * @param {any} resultData - The data payload for the response.
 * @returns {Response}
 */
export function resultResponse(resultData) {
  return new Response(
    JSON.stringify({
      status: '200',
      result: resultData,
    }),
    {
      headers: corsHeaders,
      status: 200,
    },
  )
}
