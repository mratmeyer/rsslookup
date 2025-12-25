import { appMiddleware } from "./src/middleware";

export const config = {
    matcher: [
        // Verify these matchers cover your use case
        // Match root, and shortcuts starting with /http or /https
        "/",
        "/http:path*",
        "/https:path*"
    ],
};

export default async function middleware(request: Request) {
    return await appMiddleware(request);
}
