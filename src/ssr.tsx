import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { handleURLShortcut } from "./lib/urlUtils";

const handler = createStartHandler(defaultStreamHandler);

export default (request: Request, ...args: any[]) => {
  const url = new URL(request.url);
  const shortcut = handleURLShortcut(url.pathname);
  if (shortcut) return shortcut;

  return (handler as any).fetch
    ? (handler as any).fetch(request, ...args)
    : (handler as any)(request, ...args);
};
