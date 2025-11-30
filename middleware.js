import { NextResponse } from 'next/server';

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Check if path starts with /http:/ or /https:/
  // Note: browsers normalize // to / in paths, so /https://example.com becomes /https:/example.com
  if (pathname.startsWith('/http:/') || pathname.startsWith('/https:/')) {
    // Extract the URL (remove leading /) and restore the double slash
    const url = pathname.slice(1).replace(/^(https?:)\/?/, '$1//');

    // Redirect to /?url=<url>
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('url', url);

    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts|icons|.*\\.png$).*)'],
};

