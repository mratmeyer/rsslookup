import { describe, it, expect } from "vitest";
import { readResponseBody } from "~/lib/utils/readResponseBody";

function createResponseFromText(text: string): Response {
  return new Response(text);
}

describe("readResponseBody", () => {
  it("reads full body when under the limit", async () => {
    const body = "Hello, world!";
    const response = createResponseFromText(body);
    const result = await readResponseBody(response, 1024);
    expect(result).toBe(body);
  });

  it("truncates body when over the limit", async () => {
    const body = "A".repeat(1000);
    const response = createResponseFromText(body);
    const result = await readResponseBody(response, 500);
    expect(result.length).toBeLessThanOrEqual(500);
    expect(body.startsWith(result)).toBe(true);
  });

  it("returns empty string for empty body", async () => {
    const response = createResponseFromText("");
    const result = await readResponseBody(response, 1024);
    expect(result).toBe("");
  });

  it("returns empty string when body is null", async () => {
    const response = new Response(null);
    const result = await readResponseBody(response, 1024);
    expect(result).toBe("");
  });

  it("reads exactly up to the limit", async () => {
    const body = "ABCDEFGHIJ"; // 10 bytes
    const response = createResponseFromText(body);
    const result = await readResponseBody(response, 10);
    expect(result).toBe(body);
  });

  it("handles limit of 1 byte", async () => {
    const body = "ABCDEF";
    const response = createResponseFromText(body);
    const result = await readResponseBody(response, 1);
    expect(result.length).toBeLessThanOrEqual(1);
  });
});
