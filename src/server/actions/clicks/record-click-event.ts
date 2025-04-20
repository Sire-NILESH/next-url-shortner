"use server";

import { userAgent } from "next/server";
import { db, eq } from "@/server/db";
import { urls, clickEvents } from "@/server/db/schema";
import {
  ApiResponse,
  ThreatTypeEnum,
  UrlStatusTypeEnum,
} from "@/types/server/types";
import { sql } from "drizzle-orm";

export async function recordClickEvent(
  shortCode: string,
  userAgentParsed?: ReturnType<typeof userAgent>
): Promise<
  ApiResponse<{
    originalUrl: string;
    urlStatus: UrlStatusTypeEnum;
    clicks: number;
    flagged?: boolean;
    flagReason?: string | null;
    threat?: ThreatTypeEnum;
  }>
> {
  try {
    const [url] = await db
      .update(urls)
      .set({
        clicks: sql`${urls.clicks} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(urls.shortCode, shortCode))
      .returning({
        id: urls.id,
        originalUrl: urls.originalUrl,
        clicks: urls.clicks,
        status: urls.status,
        flagged: urls.flagged,
        flagReason: urls.flagReason,
        threat: urls.threat,
        userId: urls.userId,
      });

    if (!url) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    // Trigger click event insert in background (don't block response)
    void (async () => {
      const parsed = userAgentParsed ?? null;
      await db.insert(clickEvents).values({
        urlId: url.id,
        clickedAt: new Date(),
        userId: url.userId,
        browser: parsed?.browser.name,
        platform: parsed?.os.name,
      });
    })();

    return {
      success: true,
      data: {
        originalUrl: url.originalUrl,
        urlStatus: url.status,
        clicks: url.clicks,
        threat: url.threat,
        flagged: url.flagged || false,
        flagReason: url.flagReason || null,
      },
    };
  } catch (error) {
    console.error("Error in recordClickEvent:", error);
    return {
      success: false,
      error: "An error occurred while processing the URL",
    };
  }
}
