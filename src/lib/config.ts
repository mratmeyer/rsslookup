/**
 * Central configuration for the application.
 * Accesses environment variables in a platform-agnostic way.
 */
const getEnv = (key: string): string => {
  if (typeof import.meta !== "undefined" && import.meta.env?.[key]) {
    return import.meta.env[key] as string;
  }
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key] as string;
  }
  return "";
};

/**
 * Central configuration for the application.
 * Accesses environment variables in a platform-agnostic way.
 */
export const config = {
  turnstile: {
    get siteKey() {
      return getEnv("VITE_CLOUDFLARE_TURNSTILE_SITE_KEY");
    },
    get secret() {
      return getEnv("CLOUDFLARE_TURNSTILE_SECRET");
    },
  },
};

