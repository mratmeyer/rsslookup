const CLOUDFLARE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verifies a Cloudflare Turnstile token.
 * @param token - The turnstile token from the client.
 * @param secret - The Cloudflare Turnstile secret key.
 * @param ip - The IP address of the client (optional for server actions).
 * @returns True if verification succeeds, false otherwise.
 */
export async function verifyCloudflare(
  token: string,
  secret: string,
  ip: string | null = null
): Promise<boolean> {
  if (!secret) {
    // CLOUDFLARE_TURNSTILE_SECRET is not set - verification cannot proceed
    return false;
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (ip) {
    params.append("remoteip", ip);
  }

  try {
    const response = await fetch(CLOUDFLARE_VERIFY_URL, {
      method: "POST",
      body: params,
    });
    const data = (await response.json()) as TurnstileResponse;
    return data.success === true;
  } catch {
    // Verification request failed - treat as verification failure
    return false;
  }
}
