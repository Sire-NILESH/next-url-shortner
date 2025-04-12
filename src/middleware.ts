import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/r/")) {
    const shortCode = pathname.split("/r/")[1];
    const redirectRoutHandlerUrl = req.nextUrl.clone();
    redirectRoutHandlerUrl.pathname = `/api/v1/r/${shortCode}`;

    return NextResponse.rewrite(redirectRoutHandlerUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/r/:path"],
};
