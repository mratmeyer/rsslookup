const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify'

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
