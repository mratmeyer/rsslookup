import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
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

    const request = getRequest();
    const clientIP =
      request?.headers.get("cf-connecting-ip") ||
      request?.headers.get("x-forwarded-for")?.split(",")[0] ||
      null;

    const result = await lookupFeeds(
      data.url,
      data.cloudflareToken,
      turnstileSecret,
      clientIP
    );
    return result;
  });
