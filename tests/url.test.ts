import { describe, it, expect } from "vitest";
import { handleURLShortcut, normalizeURLParamEncoding } from "../src/start";

describe("handleURLShortcut", () => {
  it("should return null for normal paths", () => {
    const response = handleURLShortcut("/");
    expect(response).toBeNull();
  });

  it("should return null for non-http paths", () => {
    const response = handleURLShortcut("/about");
    expect(response).toBeNull();
  });

  it("should redirect for URL shortcut /https://target.com", () => {
    const response = handleURLShortcut("/https://target.com");
    expect(response).not.toBeNull();
    expect(response?.status).toBe(302);
    expect(response?.headers.get("Location")).toBe(
      "/?url=https%3A%2F%2Ftarget.com",
    );
  });

  it("should redirect for URL shortcut /http://target.com", () => {
    const response = handleURLShortcut("/http://target.com");
    expect(response).not.toBeNull();
    expect(response?.status).toBe(302);
    expect(response?.headers.get("Location")).toBe(
      "/?url=http%3A%2F%2Ftarget.com",
    );
  });

  it("should handle paths with subdirectories", () => {
    const response = handleURLShortcut("/https://example.com/path/to/page");
    expect(response).not.toBeNull();
    expect(response?.status).toBe(302);
    expect(response?.headers.get("Location")).toBe(
      "/?url=https%3A%2F%2Fexample.com%2Fpath%2Fto%2Fpage",
    );
  });
});

describe("normalizeURLParamEncoding", () => {
  it("should return null for paths without query params", () => {
    const result = normalizeURLParamEncoding("/");
    expect(result).toBeNull();
  });

  it("should return null for query params without url parameter", () => {
    const result = normalizeURLParamEncoding("/?foo=bar");
    expect(result).toBeNull();
  });

  it("should return null for already properly encoded URLs", () => {
    const result = normalizeURLParamEncoding("/?url=https%3A%2F%2Ftarget.com");
    expect(result).toBeNull();
  });

  it("should normalize unencoded URL params", () => {
    // When the url param contains unencoded ://, it should be encoded
    const result = normalizeURLParamEncoding("/?url=https://target.com");
    expect(result).not.toBeNull();
    expect(result).toContain("url=https%3A%2F%2Ftarget.com");
  });
});
