import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouter } from "./router";
import { urlRedirectMiddleware } from "./middleware";

export const startInstance = createStartHandler({
  createRouter: getRouter,
  middleware: [urlRedirectMiddleware],
});

export default startInstance(defaultStreamHandler);
