import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

let routerInstance: ReturnType<typeof createRouter> | undefined;

export function getRouter() {
  if (!routerInstance) {
    routerInstance = createRouter();
  }
  return routerInstance;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
