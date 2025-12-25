import { describe, it, expect } from "vitest";
import { appMiddleware } from "../src/middleware";

describe("appMiddleware", () => {
    it("should return null for normal requests", async () => {
        const request = new Request("https://example.com/");
        const response = await appMiddleware(request);
        expect(response).toBeNull();
    });

    it("should redirect for URL shortcut /https://target.com", async () => {
        const request = new Request("https://example.com/https://target.com");
        const response = await appMiddleware(request);
        expect(response).not.toBeNull();
        expect(response?.status).toBe(302);
        expect(response?.headers.get("Location")).toBe("/?url=https%3A%2F%2Ftarget.com");
    });

    it("should normalize double encoded URLs", async () => {
        // Simulating the scenario where tanstack router might cause a redirect loop or malformed param
        // The exact logic is in normalizeURLParamEncoding. 
        // Let's test a case that WOULD trigger it.
        // e.g. /?url=https://example.com (unencoded ://)
        const request = new Request("https://example.com/?url=https://target.com");
        const response = await appMiddleware(request);

        expect(response).not.toBeNull();
        expect(response?.status).toBe(302);
        // It should encode the query param
        const location = response?.headers.get("Location");
        expect(location).toContain("url=https%3A%2F%2Ftarget.com");
    });
});
