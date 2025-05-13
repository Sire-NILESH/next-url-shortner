import "server-only";

import { userAgent } from "next/server";
import { db, eq } from "@/server/db";
import { urls, clickEvents } from "@/server/db/schema";
import { ApiResponse, Url } from "@/types/server/types";
import { sql } from "drizzle-orm";

export async function recordClickEventService(
  url: typeof urls.$inferSelect,
  userAgentParsed?: ReturnType<typeof userAgent>
): Promise<ApiResponse<Url>> {
  try {
    await db
      .update(urls)
      .set({
        clicks: sql`${urls.clicks} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(urls.id, url.id));

    void (async () => {
      await db.insert(clickEvents).values({
        urlId: url.id,
        clickedAt: new Date(),
        userId: url.userId,
        browser: userAgentParsed?.browser.name,
        platform: userAgentParsed?.os.name,
      });
    })();

    return {
      success: true,
      data: {
        ...url,
        clicks: url.clicks + 1, // optimistic count
      },
    };
  } catch (error) {
    console.error("Error in recordClickEvent:", error);
    return {
      success: false,
      error: "An error occurred while recording the click",
    };
  }
}
