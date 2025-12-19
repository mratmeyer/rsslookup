import { createServerFn } from "@tanstack/react-start";
import { lookupFeeds } from "./actions";
import { config } from "./config";

export const lookupFeedsServerFn = createServerFn()
  .inputValidator((data: { url: string; cloudflareToken: string }) => data)
  .handler(async ({ data }) => {
    const turnstileSecret = config.turnstile.secret;

    if (!turnstileSecret) {
      return {
        status: 500,
        message: "Server configuration error.",
      };
    }

    const result = await lookupFeeds(data.url, data.cloudflareToken, turnstileSecret);
    return result;
  });
