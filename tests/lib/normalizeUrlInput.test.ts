import { describe, expect, it } from "vitest";

import { ensureHttpProtocol } from "../../src/lib/normalizeUrlInput";

describe("ensureHttpProtocol", () => {
  it("adds https:// to a bare domain", () => {
    expect(ensureHttpProtocol("example.com")).toBe("https://example.com");
  });

  it("preserves the path, query, and fragment of a bare URL", () => {
    expect(ensureHttpProtocol("example.com/path?q=1#results")).toBe(
      "https://example.com/path?q=1#results",
    );
  });

  it.each([
    "http://example.com",
    "https://example.com",
    "HTTP://example.com",
    "HTTPS://example.com",
  ])("leaves an existing HTTP(S) protocol unchanged: %s", (url) => {
    expect(ensureHttpProtocol(url)).toBe(url);
  });

  it("leaves an empty value unchanged", () => {
    expect(ensureHttpProtocol("")).toBe("");
  });
});
