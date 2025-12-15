import { createServerFn } from "@tanstack/react-start";
import { lookupFeeds } from "./actions";

interface CloudflareEnv {
  CLOUDFLARE_TURNSTILE_SECRET?: string;
}

export const lookupFeedsServerFn = createServerFn()
  .handler(async (ctx: { data: { url: string; cloudflareToken: string } }) => {
    const { url, cloudflareToken } = ctx.data;

    // Load env vars inside handler (server-only context)
    const { config } = await import("dotenv");
    config({ path: ".env.local" });

    // Try to get secret from Cloudflare env or process.env
    let turnstileSecret: string | undefined;

    try {
      const { getEvent } = await import("vinxi/http");
      const event = getEvent();
      const env = (event.context?.cloudflare?.env || {}) as CloudflareEnv;
      turnstileSecret = env.CLOUDFLARE_TURNSTILE_SECRET;
    } catch {
      // Not in Cloudflare context
    }

    // Fall back to process.env
    if (!turnstileSecret) {
      turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET;
    }

    if (!turnstileSecret) {
      return {
        status: 500,
        message: "Server configuration error.",
      };
    }

    const result = await lookupFeeds(url, cloudflareToken, turnstileSecret);
    return result;
  });
