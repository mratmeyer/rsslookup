import { parse } from "tldts";

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  errorType?: string;
}

const PRIVATE_HOSTNAMES = new Set(["localhost", "localhost.localdomain"]);

const RESERVED_SUFFIXES = [
  ".local",
  ".internal",
  ".localhost",
  ".test",
  ".invalid",
  ".example",
];

export function validateUrl(parsedURL: URL): UrlValidationResult {
  // 1. Scheme must be http or https
  if (parsedURL.protocol !== "http:" && parsedURL.protocol !== "https:") {
    return {
      valid: false,
      error: "Only http and https URLs are supported.",
      errorType: "invalid_scheme",
    };
  }

  const hostname = parsedURL.hostname;

  // 2. Reject private hostnames
  if (PRIVATE_HOSTNAMES.has(hostname)) {
    return {
      valid: false,
      error: "URLs pointing to local or internal networks are not allowed.",
      errorType: "private_network",
    };
  }

  // 3. Reject reserved suffixes
  for (const suffix of RESERVED_SUFFIXES) {
    if (hostname.endsWith(suffix)) {
      return {
        valid: false,
        error: "URLs pointing to local or internal networks are not allowed.",
        errorType: "private_network",
      };
    }
  }

  // 4. Reject IP addresses
  const parsed = parse(hostname);
  if (parsed.isIp) {
    return {
      valid: false,
      error: "Please provide a domain name instead of an IP address.",
      errorType: "ip_address",
    };
  }

  // 5. Must have a valid domain
  if (!parsed.domain) {
    return {
      valid: false,
      error:
        "Please provide a URL with a valid domain name (e.g., example.com).",
      errorType: "invalid_domain",
    };
  }

  return { valid: true };
}
