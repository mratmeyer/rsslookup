# 🔎 RSS Lookup

[![GitHub Repo stars](https://img.shields.io/github/stars/mratmeyer/rsslookup?style=social)](https://github.com/mratmeyer/rsslookup/stargazers)

RSS Lookup is a free, open-source tool designed to find the RSS feed associated with any URL. Simply paste the website's address, and RSS Lookup will intelligently scan the site's HTML for feed links and check common feed path conventions.

**Check out the live tool:** [**www.rsslookup.com**](https://www.rsslookup.com/)

## Features

- **Simple Interface:** Clean, easy-to-use single-page application.
- **HTML Meta Tag Detection:** Finds feeds specified using standard `<link rel="alternate" type="application/rss+xml">` (and Atom) tags.
- **Common Path Fallback:** Checks conventional paths like `/feed`, `/rss.xml`, `/atom.xml` if no tags are found.
- **Popular Site Integration:** Rules to natively supports popular sites like YouTube, StackExchange, and Reddit.
- **Abuse Prevention:** Integrates Cloudflare Turnstile to protect the backend service.
- **User-Friendly Results:** Displays found feed URLs clearly and easily copiable.
- **Modern Tech:** Built with TanStack Start, Vite, and Cloudflare Workers for a seamless full-stack experience at the edge.

## Project Structure

This repository contains a full-stack application built with TanStack Start:

- `src/routes/`: File-based routing (frontend & API)
- `src/components/`: React components
- `src/lib/`: Shared utilities and server functions
- `src/styles/`: CSS and Tailwind styles
- `public/`: Static assets
- `worker/`: Cloudflare Worker entry point

## Getting Started

Follow these instructions to set up and run the project locally or deploy your own instance.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended, e.g., >= 18)
- [npm](https://www.npmjs.com/) (usually included with Node.js)
- A [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) account (for site key and secret)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mratmeyer/rsslookup.git
    cd rsslookup
    ```

2.  **Environment Variables:**

    Create a file named `.env` in the **root** directory. Add the following variables:

    ```dotenv
    # .env

    # Your Cloudflare Turnstile Site Key (public - used by frontend)
    VITE_CLOUDFLARE_TURNSTILE_SITE_KEY=YOUR_CLOUDFLARE_TURNSTILE_SITE_KEY

    # Your Cloudflare Turnstile Secret Key (server-side only)
    CLOUDFLARE_TURNSTILE_SECRET=YOUR_CLOUDFLARE_TURNSTILE_SECRET_KEY
    ```

3.  **Install Dependencies:**

    ```bash
    npm ci
    ```

### Running Locally

**Run the Development Server:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or another port if 3000 is busy).

**Preview with Wrangler (Cloudflare Worker environment):**

```bash
npm run dev:wrangler
```

### Building & Deploying

**Build the Application:**

```bash
npm run build
```

**Deployment:**

This application is configured for Cloudflare Workers.

To deploy to Cloudflare:

```bash
npm run deploy
```

Make sure to set the `CLOUDFLARE_TURNSTILE_SECRET` and `VITE_CLOUDFLARE_TURNSTILE_SITE_KEY` environment variables in your Cloudflare dashboard/settings.

## Adding Custom Site Rules

Some websites have RSS feeds but don't advertise them via standard HTML `<link>` tags. Site-specific rules allow RSS Lookup to discover these "hidden" feeds by recognizing URL patterns and constructing feed URLs programmatically.

For example, YouTube doesn't expose channel feeds in page metadata, but every channel has a feed at `youtube.com/feeds/videos.xml?channel_id=...`. The YouTube rule extracts the channel ID from the URL and builds the feed URL.

**Current built-in rules:** Reddit, YouTube, GitHub, Stack Exchange

### Creating a New Rule

Rules live in `src/lib/rules/`. Each rule implements the `SiteRule` interface:

```typescript
interface SiteRule {
  name: string;
  matchesHostname(hostname: string): boolean;
  extractFeeds(context: RuleContext, feedsMap: FeedsMap): void;
}
```

**To add a new rule:**

1. Create `src/lib/rules/YourSiteRule.ts`:

   ```typescript
   import type { FeedsMap } from "../types";
   import type { SiteRule, RuleContext } from "./SiteRule";

   export class YourSiteRule implements SiteRule {
     readonly name = "Your Site";

     matchesHostname(hostname: string): boolean {
       return hostname === "example.com" || hostname === "www.example.com";
     }

     extractFeeds(context: RuleContext, feedsMap: FeedsMap): void {
       // Extract feeds and add to feedsMap
       feedsMap.set(`${context.origin}/feed.xml`, "Example Feed");
     }
   }
   ```

2. Register it in `src/lib/rules/index.ts`:

   ```typescript
   import { YourSiteRule } from "./YourSiteRule";
   
   const rules: SiteRule[] = [
     // ... existing rules
     new YourSiteRule(),
   ];
   ```

3. Add tests in `tests/lib/rules.test.ts`.

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run dev:wrangler`: Builds and starts the development server with Wrangler.
- `npm run build`: Builds the application for production.
- `npm run preview`: Locally preview the production build.
- `npm run deploy`: Builds and deploys the application to Cloudflare Workers.
- `npm run lint`: Runs ESLint to check for code style issues.
- `npm run format`: Runs Prettier to format the code.

## License

This project is open source under the Apache 2.0 License. Please see the `LICENSE` file for details.

## Support

RSS Lookup is ad free, open-source, and privacy respecting, now and in the future. If you find RSS Lookup helpful and would like to show your appreciation, you can support its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/mratmeyer)

---

Created by **Max Ratmeyer** - [Personal Site](https://www.maxratmeyer.com/?utm_source=rsslookup-github)
