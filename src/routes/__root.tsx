import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import appCss from "~/styles/tailwind.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "RSS Lookup is a free, open-source tool that helps you search for RSS feeds on any URL",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "/fonts/style.css" },
      {
        rel: "preload",
        href: "/fonts/inter-v2-latin-400-600-700.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      {
        src: "/u/script.js",
        defer: true,
        "data-website-id": "a8f55736-8547-49f3-a40d-dc2845f232e9",
        "data-host-url": "/u",
      },
    ],
  }),

  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: "rgb(var(--success))",
                color: "rgb(var(--success-foreground))",
              },
            },
            error: {
              style: {
                background: "rgb(var(--destructive))",
                color: "rgb(var(--destructive-foreground))",
              },
            },
          }}
        />
        <div className="m-auto max-w-3xl p-6 lg:p-12 min-h-screen">
          <div className="mb-12">
            <Outlet />
          </div>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <div className="text-center text-sm text-muted-foreground font-medium space-y-2 pb-8">
      <p>
        Made with{" "}
        <img
          src="/heart.png"
          alt="Heart Emoji"
          className="inline align-middle opacity-80"
          width="16"
          height="16"
        />{" "}
        in Atlanta by{" "}
        <a
          className="hover:text-primary transition-colors duration-200"
          target="_blank"
          rel="noreferrer noopener"
          href="https://www.maxratmeyer.com/?utm_source=rsslookup"
        >
          Max
        </a>
      </p>
      <p>
        View source on{" "}
        <a
          className="hover:text-primary transition-colors duration-200"
          target="_blank"
          rel="noreferrer noopener"
          href="https://github.com/mratmeyer/rsslookup"
        >
          GitHub
        </a>
      </p>
      <p>
        <a
          className="hover:text-primary transition-colors duration-200"
          target="_blank"
          rel="noreferrer noopener"
          href="https://share.maxnet.work/rsslookup/terms.pdf"
        >
          Terms
        </a>
        <span className="mx-2">&middot;</span>
        <a
          className="hover:text-primary transition-colors duration-200"
          target="_blank"
          rel="noreferrer noopener"
          href="https://share.maxnet.work/rsslookup/privacy.pdf"
        >
          Privacy
        </a>
      </p>
    </div>
  );
}
