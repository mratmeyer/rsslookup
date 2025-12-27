import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      lineHeight: {
        hero: "1.15",
      },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-heading":
          "rgb(var(--foreground-heading) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground":
          "rgb(var(--secondary-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        destructive: "rgb(var(--destructive) / <alpha-value>)",
        "destructive-foreground":
          "rgb(var(--destructive-foreground) / <alpha-value>)",
        "destructive-border": "rgb(var(--destructive-border) / <alpha-value>)",
        "destructive-icon": "rgb(var(--destructive-icon) / <alpha-value>)",
        banner: "rgb(var(--banner-background) / <alpha-value>)",
        "banner-foreground": "rgb(var(--banner-foreground) / <alpha-value>)",
        "banner-border": "rgb(var(--banner-border) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        "input-border": "rgb(var(--input-border) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        url: "rgb(var(--url-background) / <alpha-value>)",
        "url-foreground": "rgb(var(--url-foreground) / <alpha-value>)",
      },
    },
    fontFamily: {
      sans: ["Outfit", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
