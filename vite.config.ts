import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [
    // Use Cloudflare plugin for production and wrangler dev builds
    (mode === "production" || mode === "wrangler") &&
      cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    react(),
    tsconfigPaths(),
  ].filter(Boolean),
}));
