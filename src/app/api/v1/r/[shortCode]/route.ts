import { recordClickEventService } from "@/server/services/clicks/record-click-event.service";
import { checkUrlAccess } from "@/server/services/url/check-url-access.service";
import { WarnRedirectSearchParams } from "@/types/server/types";
import { NextRequest, NextResponse, userAgent } from "next/server";

type Params = Promise<{ shortCode: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  const notFound = req.nextUrl.clone();
  notFound.pathname = "/redirect/url/not-found";

  try {
    const userAgentParsed = userAgent(req);
    const { shortCode } = await props.params;

    const accessResult = await checkUrlAccess(shortCode);

    if (!accessResult.allowed) {
      const redirect = req.nextUrl.clone();
      switch (accessResult.reason) {
        case "not_found":
          redirect.pathname = "/redirect/url/not-found";
          break;
        case "suspended":
        case "inactive":
        case "flagged_limit_reached":
          redirect.pathname = "/redirect/url/blocked";
          break;
      }
      return NextResponse.redirect(redirect, 302);
    }

    const url = accessResult.url;
    const response = await recordClickEventService(url, userAgentParsed);

    if (response.success && response.data) {
      if (url.flagged) {
        const warnRedirectUrl = req.nextUrl.clone();
        warnRedirectUrl.pathname = "/redirect/url/warn";

        const obj: WarnRedirectSearchParams = {
          flagged: String(url.flagged),
        };

        if (url.threat) {
          obj.threat = encodeURIComponent(url.threat);
        } else {
          obj.redirect = encodeURIComponent(url.originalUrl);
        }

        if (url.flagReason) {
          obj.reason = encodeURIComponent(url.flagReason);
        }

        warnRedirectUrl.search = new URLSearchParams(obj).toString();
        return NextResponse.redirect(warnRedirectUrl, 302);
      }

      return NextResponse.redirect(url.originalUrl, 302);
    }

    return NextResponse.redirect(notFound, 302);
  } catch (error) {
    console.error(`Error in : ${req.nextUrl.pathname}`, error);
    return NextResponse.redirect(notFound, 302);
  }
}
