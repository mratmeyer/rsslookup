import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [
    // Only use Cloudflare plugin for production builds
    mode === "production" && cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react(),
    tsconfigPaths(),
  ].filter(Boolean),
}));
