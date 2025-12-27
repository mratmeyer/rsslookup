import { Link } from "@tanstack/react-router";

export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-4">
                404
            </h1>
            <h2 className="text-2xl font-semibold text-foreground-heading mb-4">
                Page not found
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been
                removed or doesn't exist.
            </p>
            <Link
                to="/"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors duration-200"
            >
                Go back home
            </Link>
        </div>
    );
}
