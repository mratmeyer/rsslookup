# RSS Lookup

RSS Lookup is a free tool to find the RSS feed for any website. The frontend is a single page app built using Next.js, and the backend is a Cloudflare Worker.

To check out RSS Lookup in production, go to [www.rsslookup.com](https://www.rsslookup.com/).

## Installation and Project Structure

Currently, the Next.js frontend lives in the root project folder, and the Cloudflare Worker helper lives in the `worker` folder.

To install the frontend,

1. Install the node dependencies with `npm ci`
2. Build the Next.js app with `npm run build`
3. The output is a static export that lives in the `out` folder

To set up the worker,

1. Install the node dependencies with `npm ci`
2. Modify the `wrangler.toml` file with the correct route
3. Test the worker in a dev environment with `npx wrangler dev`
4. Deploy the worker into prod with `npx wrangler deploy`
