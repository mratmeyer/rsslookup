const CLOUDFLARE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verifies a Cloudflare Turnstile token.
 * @param {string} token - The turnstile token from the client.
 * @param {string} ip - The IP address of the client (optional for server actions).
 * @returns {Promise<boolean>} - True if verification succeeds, false otherwise.
 */
export async function verifyCloudflare(token, ip = null) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET;
  
  if (!secret) {
    // CLOUDFLARE_TURNSTILE_SECRET is not set - verification cannot proceed
    return false;
  }

  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);
  if (ip) {
    params.append('remoteip', ip);
  }

  try {
    const response = await fetch(CLOUDFLARE_VERIFY_URL, {
      method: 'POST',
      body: params,
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    // Verification request failed - treat as verification failure
    return false;
  }
}

