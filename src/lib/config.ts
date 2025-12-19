/**
 * Central configuration for the application.
 * Accesses environment variables in a platform-agnostic way.
 */
const getEnv = (key: string, fallback = ""): string => {
  return (import.meta.env[key] || (typeof process !== "undefined" ? process.env[key] : fallback) || fallback) as string;
};

/**
 * Central configuration for the application.
 * Accesses environment variables in a platform-agnostic way.
 */
export const config = {
  turnstile: {
    siteKey: getEnv("VITE_CLOUDFLARE_TURNSTILE_SITE_KEY"),
    secret: getEnv("CLOUDFLARE_TURNSTILE_SECRET"),
  },
  isProd: import.meta.env.PROD,
  isWrangler: import.meta.env.MODE === "wrangler",
};

