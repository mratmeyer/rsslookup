import { describe, it, expect } from "vitest";
import { validateUrl } from "~/lib/validateUrl";

describe("validateUrl", () => {
  // ============================================
  // 1. SCHEME VALIDATION
  // ============================================
  describe("Scheme validation", () => {
    it("accepts http URLs", () => {
      const result = validateUrl(new URL("http://example.com"));
      expect(result.valid).toBe(true);
    });

    it("accepts https URLs", () => {
      const result = validateUrl(new URL("https://example.com"));
      expect(result.valid).toBe(true);
    });

    it("rejects ftp URLs", () => {
      const result = validateUrl(new URL("ftp://example.com"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("invalid_scheme");
      expect(result.error).toBe("Only http and https URLs are supported.");
    });

    it("rejects file URLs", () => {
      const result = validateUrl(new URL("file:///etc/passwd"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("invalid_scheme");
    });

    it("rejects javascript URLs", () => {
      // eslint-disable-next-line no-script-url
      const result = validateUrl(new URL("javascript:alert(1)"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("invalid_scheme");
    });

    it("rejects data URLs", () => {
      const result = validateUrl(new URL("data:text/html,<h1>Hi</h1>"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("invalid_scheme");
    });
  });

  // ============================================
  // 2. IP ADDRESS VALIDATION
  // ============================================
  describe("IP address validation", () => {
    it("rejects private IPv4 addresses", () => {
      const result = validateUrl(new URL("http://192.168.1.1/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("ip_address");
      expect(result.error).toBe(
        "Please provide a domain name instead of an IP address.",
      );
    });

    it("rejects internal network IPs", () => {
      const result = validateUrl(new URL("http://10.0.0.1/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("ip_address");
    });

    it("rejects public IPv4 addresses", () => {
      const result = validateUrl(new URL("http://8.8.8.8/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("ip_address");
    });

    it("rejects IPv6 loopback", () => {
      const result = validateUrl(new URL("http://[::1]/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("ip_address");
    });

    it("rejects IPv6 addresses", () => {
      const result = validateUrl(new URL("http://[2001:db8::1]/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("ip_address");
    });
  });

  // ============================================
  // 3. PRIVATE HOSTNAME VALIDATION
  // ============================================
  describe("Private hostname validation", () => {
    it("rejects localhost", () => {
      const result = validateUrl(new URL("http://localhost/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
      expect(result.error).toBe(
        "URLs pointing to local or internal networks are not allowed.",
      );
    });

    it("rejects localhost.localdomain", () => {
      const result = validateUrl(new URL("http://localhost.localdomain/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
    });

    it("rejects .local suffix", () => {
      const result = validateUrl(new URL("http://myserver.local/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
    });

    it("rejects .internal suffix", () => {
      const result = validateUrl(new URL("http://app.internal/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
    });

    it("rejects .localhost suffix", () => {
      const result = validateUrl(new URL("http://app.localhost/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
    });

    it("rejects .test suffix", () => {
      const result = validateUrl(new URL("http://myapp.test/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
    });

    it("rejects .invalid suffix", () => {
      const result = validateUrl(new URL("http://site.invalid/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
    });

    it("rejects .example suffix", () => {
      const result = validateUrl(new URL("http://site.example/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("private_network");
    });
  });

  // ============================================
  // 4. INVALID DOMAIN VALIDATION
  // ============================================
  describe("Invalid domain validation", () => {
    it("rejects hostname without TLD", () => {
      const result = validateUrl(new URL("http://myserver/feed"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("invalid_domain");
      expect(result.error).toBe(
        "Please provide a URL with a valid domain name (e.g., example.com).",
      );
    });

    it("rejects bare TLD as hostname", () => {
      const result = validateUrl(new URL("http://com/"));
      expect(result.valid).toBe(false);
      expect(result.errorType).toBe("invalid_domain");
    });
  });

  // ============================================
  // 5. VALID URL ACCEPTANCE
  // ============================================
  describe("Valid URL acceptance", () => {
    it("accepts standard https URL", () => {
      const result = validateUrl(new URL("https://example.com"));
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.errorType).toBeUndefined();
    });

    it("accepts URL with subdomain and ccTLD", () => {
      const result = validateUrl(
        new URL("https://blog.example.co.uk/feed.xml"),
      );
      expect(result.valid).toBe(true);
    });

    it("accepts http URL with port", () => {
      const result = validateUrl(new URL("http://example.com:8080/feed"));
      expect(result.valid).toBe(true);
    });
  });
});
