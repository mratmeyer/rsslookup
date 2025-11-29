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
- **Modern Tech:** Built with Next.js with integrated API routes for a seamless full-stack experience.

## Project Structure

This repository contains a full-stack Next.js application:

- `pages/`: Next.js pages (frontend)
- `components/`: React components
- `lib/`: Server-side utilities for RSS feed lookup
- `pages/api/`: API routes for server-side feed lookup
- `styles/`: CSS and Tailwind styles
- `public/`: Static assets

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

    Create a file named `.env.local` in the **root** directory. Add the following variables:

    ```dotenv
    # .env.local

    # Your Cloudflare Turnstile Site Key (public - used by frontend)
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=YOUR_CLOUDFLARE_TURNSTILE_SITE_KEY

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

### Building & Deploying

**Build the Application:**

```bash
npm run build
```

**Deployment Options:**

This Next.js application uses API routes and requires a server runtime. Recommended deployment platforms:

- **Vercel:** Native Next.js support with automatic Server Action handling
- **Cloudflare Pages:** Use `@cloudflare/next-on-pages` adapter for edge deployment
- **Self-hosted:** Run with `npm start` on a Node.js server

For Cloudflare Pages deployment, set the `CLOUDFLARE_TURNSTILE_SECRET` environment variable in your Cloudflare Pages dashboard settings.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs ESLint to check for code style issues.
- `npm run format`: Runs Prettier to format the code.

## License

This project is open source under the Apache 2.0 License. Please see the `LICENSE` file for details.

## Support

RSS Lookup is ad free, open-source, and privacy respecting, now and in the future. If you find RSS Lookup helpful and would like to show your appreciation, you can support its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/mratmeyer)

---

Created by **Max Ratmeyer** - [Personal Site](https://www.maxratmeyer.com/?utm_source=rsslookup-github)
