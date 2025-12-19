import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import { handleURLShortcut } from "./src/lib/urlUtils";

export default defineConfig(({ mode }) => ({
  plugins: [
    {
      name: "url-shortcut-middleware",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const redirect = req.url ? handleURLShortcut(req.url) : null;
          const location = redirect?.headers.get("Location");

          if (location) {
            res.writeHead(302, { Location: location });
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

