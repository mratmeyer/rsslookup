import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import { handleURLShortcut, normalizeURLParamEncoding } from "./src/lib/urlUtils";

export default defineConfig(({ mode }) => ({
  plugins: [
    {
      name: "url-shortcut-middleware",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle URL shortcut redirects (e.g., /https://example.com -> /?url=...)
          const shortcutRedirect = req.url ? handleURLShortcut(req.url) : null;
          if (shortcutRedirect) {
            const location = shortcutRedirect.headers.get("Location");
            if (location) {
              res.writeHead(302, { Location: location });
              return res.end();
            }
          }
          
          // Normalize URL param encoding to prevent TanStack Router redirect loops
          const normalizedUrl = req.url ? normalizeURLParamEncoding(req.url) : null;
          if (normalizedUrl) {
            res.writeHead(302, { Location: normalizedUrl });
            return res.end();
          }
          
          next();
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

