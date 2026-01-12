import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { Navbar } from "~/components/Navbar";
import { ScrollReveal } from "~/components/ScrollReveal";
import appCss from "~/styles/tailwind.css?url";

import { NotFound } from "~/components/NotFound";

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
      { rel: "icon", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.bunny.net" },
      {
        rel: "stylesheet",
        href: "https://fonts.bunny.net/css?family=outfit:100,200,300,400,500,600,700,800,900",
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
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground tracking-[0.015em]">
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
          <Navbar />
          <div className="mb-12">
            <Outlet />
          </div>
          <ScrollReveal threshold={0.1} delay={200}>
            <Footer />
          </ScrollReveal>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <div className="border-t border-border mt-12 pt-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
        <p>
          Made with{" "}
          <img
            src="/heart.png"
            alt="Heart Emoji"
            className="inline align-middle opacity-80"
            width="14"
            height="14"
          />{" "}
          in NYC by{" "}
          <a
            className="text-foreground hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://www.maxratmeyer.com/?utm_source=rsslookup"
          >
            Max
          </a>
        </p>

        <div className="flex items-center gap-6">
          <a
            className="hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/mratmeyer/rsslookup"
          >
            GitHub
          </a>
          <a
            className="hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://share.maxnet.work/rsslookup/terms.pdf"
          >
            Terms
          </a>
          <a
            className="hover:text-primary transition-colors duration-200"
            target="_blank"
            rel="noreferrer noopener"
            href="https://share.maxnet.work/rsslookup/privacy.pdf"
          >
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
}
