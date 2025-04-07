const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify'
const CLOUDFLARE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Verifies an hCaptcha token.
 * @param {string} token - The hCaptcha token from the client.
 * @returns {Promise<boolean>} - True if verification succeeds, false otherwise.
 */
export async function verifyHCaptcha(token) {
  if (!HCAPTCHA_SECRET) {
    console.error('HCAPTCHA_SECRET is not set in environment variables.')
    return false
  }

  const params = new URLSearchParams()
  params.append('secret', HCAPTCHA_SECRET)
  params.append('response', token)

  try {
    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: 'POST',
      body: params,
    })
    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Error verifying hCaptcha:', error)
    return false
  }
}

/**
 * Verifies a Cloudflare Turnstile token.
 * @param {string} token - The turnstile token from the client.
 * @param {string} ip - The IP address of the client.
 * @returns {Promise<boolean>} - True if verification succeeds, false otherwise.
 */
export async function verifyCloudflare(token, ip) {
  if (!CLOUDFLARE_TURNSTILE_SECRET) {
    console.error(
      'CLOUDFLARE_TURNSTILE_SECRET is not set in environment variables.',
    )
    return false
  }

  const params = new URLSearchParams()
  params.append('secret', CLOUDFLARE_TURNSTILE_SECRET)
  params.append('response', token)
  params.append('remoteip', ip)

  try {
    const response = await fetch(CLOUDFLARE_VERIFY_URL, {
      method: 'POST',
      body: params,
    })
    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Error verifying Cloudflare:', error)
    return false
  }
}
