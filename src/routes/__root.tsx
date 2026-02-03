import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { NotFound } from "~/components/NotFound";
import { ScrollReveal } from "~/components/ScrollReveal";
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
