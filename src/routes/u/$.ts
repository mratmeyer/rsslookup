import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/u/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat;

        // Handle /u/script.js
        if (path === "script.js") {
          const response = await fetch("https://cloud.umami.is/script.js");
          const script = await response.text();

          return new Response(script, {
            headers: {
              "Content-Type": "application/javascript",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }

        return new Response("Not Found", { status: 404 });
      },
    },
  },
});
