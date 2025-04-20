import { recordClickEvent } from "@/server/actions/clicks/record-click-event";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { WarnRedirectSearchParams } from "@/types/server/types";

type Params = Promise<{ shortCode: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  const userAgentParsed = userAgent(req);
  const { shortCode } = await props.params;

  const response = await recordClickEvent(shortCode, userAgentParsed);

  if (response.success && response.data) {
    const url = response.data;

    if (url.flagged) {
      const warnRedirectRUrl = req.nextUrl.clone();
      warnRedirectRUrl.pathname = "/redirect/url/warn";

      const redirectUrl = url.originalUrl;
      const obj: WarnRedirectSearchParams = {
        flagged: encodeURIComponent(url.flagged),
      };

      if (url.threat) {
        obj.threat = encodeURIComponent(url.threat);
        // if threat is detected we do not proceed or even show the resolved URL.
      } else {
        obj.redirect = encodeURIComponent(redirectUrl);
      }

      if (url.flagReason) obj.reason = encodeURIComponent(url.flagReason);

      const searchParams = new URLSearchParams(obj).toString();

      warnRedirectRUrl.search = searchParams;
      return NextResponse.redirect(warnRedirectRUrl, 302);
    }

    return NextResponse.redirect(url.originalUrl, 302);
  }

  const notFoundRedirectRUrl = req.nextUrl.clone();
  notFoundRedirectRUrl.pathname = "/redirect/url/not-found";

  return NextResponse.redirect(notFoundRedirectRUrl, 302);
}
