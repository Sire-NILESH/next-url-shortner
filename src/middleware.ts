import { NextRequest, NextResponse } from "next/server";
import { auth } from "./server/auth";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /**
   * For handling short-url redirects.
   * Handle this BEFORE auth to completely bypass authentication
   * Redirects short urls like "my-domain/r/343re3" to "my-domain/api/v1/r/343re3"
   * and that route handler handles further exe.
   */
  if (pathname.startsWith("/r/")) {
    const pathParts = pathname.split("/r/");
    if (pathParts.length > 1 && pathParts[1]) {
      const shortCode = pathParts[1];
      const rewriteUrl = req.nextUrl.clone();
      rewriteUrl.pathname = `/api/v1/r/${shortCode}`;

      return NextResponse.rewrite(rewriteUrl);
    }
  }

  /**
   * For all other paths, delegate to NextAuth middleware.
   * This will use 'authorized' callback from the auth.config.ts file
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (auth as any)(req);
}

export const config = {
  matcher: [
    "/r/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
