import { appMiddleware } from "./src/middleware";

export const config = {
    matcher: [
        "/",
        "/http:path*",
        "/https:path*"
    ],
};

export default async function middleware(request: Request) {
    return await appMiddleware(request);
}
