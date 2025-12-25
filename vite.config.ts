import { defineConfig, type ViteDevServer, type Connect } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import { appMiddleware } from "./src/middleware";

export default defineConfig(({ mode }) => ({
  plugins: [
    {
      name: "url-shortcut-middleware",
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
          async function handleRequest() {
            if (!req.url) {
              return next();
            }

            // Create a dummy Request object for the middleware
            // Base URL is required but not used by our logic
            const request = new Request(`http://localhost${req.url}`);

            const response = await appMiddleware(request);

            if (response) {
              res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
              return res.end();
            }

            next();
          }

          handleRequest().catch(next);
        });
      },
    },
    // Use Cloudflare plugin for production and wrangler dev builds
    (mode === "production" || mode === "wrangler") &&
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react(),
    tsconfigPaths(),
  ].filter(Boolean),
}));

