import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { lookupFeeds } from "./actions";

export const lookupFeedsServerFn = createServerFn()
  .inputValidator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const request = getRequest();
    const clientIP =
      request?.headers.get("cf-connecting-ip") ||
      request?.headers.get("x-forwarded-for")?.split(",")[0] ||
      null;

    const result = await lookupFeeds(data.url, clientIP);
    return result;
  });
