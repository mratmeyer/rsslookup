import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/u/send")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();

        const clientIP =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0] ||
          "127.0.0.1";

        const response = await fetch("https://cloud.umami.is/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": request.headers.get("user-agent") || "",
            "X-Forwarded-For": clientIP,
          },
          body,
        });

        const data = await response.text();

        return new Response(data, {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  },
});
