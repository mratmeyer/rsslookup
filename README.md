# 🔎 RSS Lookup

[![GitHub Repo stars](https://img.shields.io/github/stars/mratmeyer/rsslookup?style=social)](https://github.com/mratmeyer/rsslookup/stargazers)

RSS Lookup is a free, open-source tool designed to find the RSS feed associated with any URL. Simply paste the website's address, and RSS Lookup will intelligently scan the site's HTML for feed links and check common feed path conventions.

**Check out the live tool:** [**www.rsslookup.com**](https://www.rsslookup.com/)

## Features

- **Simple Interface:** Clean, easy-to-use single-page application.
- **HTML Meta Tag Detection:** Finds feeds specified using standard `<link rel="alternate" type="application/rss+xml">` (and Atom) tags.
- **Common Path Fallback:** Checks conventional paths like `/feed`, `/rss.xml`, `/atom.xml` if no tags are found.
- **Abuse Prevention:** Integrates Cloudflare Turnstile to protect the backend service.
- **User-Friendly Results:** Displays found feed URLs clearly and easily copiable.
- **Modern Tech:** Built with Next.js for the frontend and Cloudflare Workers for a fast, serverless backend.

## Project Structure

This repository contains both the frontend and backend code:

- `.`: Root directory contains the Next.js frontend application.
- `worker/`: Contains the Cloudflare Worker backend API code.

## Getting Started

Follow these instructions to set up and run the project locally or deploy your own instance.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended, e.g., >= 18)
- [npm](https://www.npmjs.com/) (usually included with Node.js)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/): Install globally with `npm install -g wrangler`
- A Cloudflare account (for deploying the worker)
- A [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) account (for site key and secret)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/mratmeyer/rsslookup.git](https://github.com/mratmeyer/rsslookup.git)
    cd rsslookup
    ```

2.  **Environment Variables:**

    - **Frontend:** Create a file named `.env.local` in the **root** directory. Add the following variables:

      ```dotenv
      # .env.local (Frontend - in root directory)

      # The URL of your deployed Cloudflare Worker API
      NEXT_PUBLIC_API_URL=[https://api.example.com](https://api.example.com)

      # Your Cloudflare Turnstile Site Key (public)
      NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=YOUR_CLOUDFLARE_TURNSTILE_SITE_KEY
      ```

    - **Backend:** You'll need to set the `CLOUDFLARE_TURNSTILE_SECRET` as a secret for your Cloudflare Worker.
      - Run this command within the `worker/` directory after logging in with Wrangler:
        ```bash
        # Run inside the worker/ directory
        npx wrangler secret put CLOUDFLARE_TURNSTILE_SECRET
        ```
      - Wrangler will prompt you to enter your Cloudflare Turnstile secret key.

3.  **Install Dependencies:**

    - **Frontend:**
      ```bash
      # Inside the root directory
      npm ci
      ```
    - **Backend:**
      ```bash
      # Inside the worker directory
      cd worker
      npm ci
      ```

### Running Locally

1.  **Run the Frontend Development Server:**

    ```bash
    # Inside the root directory
    npm run dev
    ```

    The frontend will be available at `http://localhost:3000` (or another port if 3000 is busy). It needs the backend worker running to function fully.

2.  **Run the Backend Worker Locally:**
    ```bash
    # In the worker/ directory
    # Make sure you've set the CLOUDFLARE_TURNSTILE_SECRET locally for testing if needed,
    # or mock the verifyCloudflare function for local dev without turnstile checks.
    npx wrangler dev
    ```
    The worker will run locally. Update `NEXT_PUBLIC_API_URL` in your frontend `.env.local` to point to the local worker URL (e.g., `http://localhost:8787`) for local end-to-end testing.

### Building & Deploying

1.  **Build the Frontend (Static Export):**

    ```bash
    # In the root directory
    npm run build
    ```

    This generates static HTML/CSS/JS files in the `/out` directory, ready for deployment to any static hosting provider.

2.  **Deploy the Backend Worker:**
    - Make sure your `worker/wrangler.toml` file has the correct `name` and `route` configured for your Cloudflare account and desired domain.
    - Deploy using Wrangler:
      ```bash
      # In the worker/ directory
      npx wrangler deploy
      ```
    - Remember to set the `CLOUDFLARE_TURNSTILE_SECRET` in your deployed worker's environment using `wrangler secret put`.

## Available Scripts

### Frontend (Run from root directory)

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production (static export).
- `npm run start`: Starts a production server (less common for static exports).
- `npm run lint`: Runs ESLint to check for code style issues.
- `npm run format`: Runs Prettier to format the code.

### Backend (Run from `worker/` directory)

- `npm run format`: Runs Prettier to format the code.
- `npx wrangler dev`: Runs the worker locally for development.
- `npx wrangler deploy`: Deploys the worker to Cloudflare.

## License

This project is open source under the Apache 2.0 License. Please see the `LICENSE` file for details.

## Support

RSS Lookup is ad free, open-source, and privacy respecting, now and in the future. If you find RSS Lookup helpful and would like to show your appreciation, you can support its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/mratmeyer)

---

Created by **Max Ratmeyer** - [Personal Site](https://www.maxratmeyer.com/?utm_source=rsslookup-github)
