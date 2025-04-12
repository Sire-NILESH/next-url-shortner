import { getUrlByShortCode } from "@/server/actions/urls/get-url";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ shortCode: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  const { shortCode } = await props.params;
  const response = await getUrlByShortCode(shortCode);

  if (response.success && response.data) {
    return NextResponse.redirect(response.data.originalUrl, 302);
  }

  const notFoundRedirectRUrl = req.nextUrl.clone();
  notFoundRedirectRUrl.pathname = `/r/${shortCode}/url-not-found`;

  return NextResponse.redirect(notFoundRedirectRUrl, 302);
}
