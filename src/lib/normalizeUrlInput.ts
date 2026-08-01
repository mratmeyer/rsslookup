const HTTP_PROTOCOL_PATTERN = /^https?:\/\//i;

/**
 * Add the default HTTPS protocol to URL input that does not already use HTTP(S).
 */
export function ensureHttpProtocol(value: string): string {
  if (!value || HTTP_PROTOCOL_PATTERN.test(value)) {
    return value;
  }

  return `https://${value}`;
}
