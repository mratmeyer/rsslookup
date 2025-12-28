import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { lookupFeeds } from "./actions";
import type { CloudflareEnv } from "./types";

export const lookupFeedsServerFn = createServerFn()
  .inputValidator((data: { url: string; source?: string }) => data)
  .handler(async ({ data }) => {
    const request = getRequest();

    // Get Cloudflare Env from the global process shim (populated by worker/index.ts)
    // @ts-ignore
    const env = (globalThis.process?.env as CloudflareEnv) || {};

    // Get ExecutionContext for waitUntil (populated by worker/index.ts)
    // @ts-ignore
    const ctx = globalThis.__cfCtx as ExecutionContext | undefined;

    const clientIP =
      request?.headers.get("cf-connecting-ip") ||
      request?.headers.get("x-forwarded-for")?.split(",")[0] ||
      null;

    const result = await lookupFeeds(data.url, clientIP, env, data.source, ctx);
    return result;
  });
