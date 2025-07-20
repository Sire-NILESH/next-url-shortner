import "server-only";

import { db, eq } from "@/server/db";
import { clickEvents, urls } from "@/server/db/schema";
import { ApiResponse, CacheUrl } from "@/types/server/types";
import { sql } from "drizzle-orm";
import { userAgent } from "next/server";

export async function recordClickEventService(
  url: CacheUrl,
  userAgentParsed?: ReturnType<typeof userAgent>
): Promise<ApiResponse<null>> {
  try {
    const now = new Date();
    await db
      .update(urls)
      .set({
        clicks: sql`${urls.clicks} + 1`,
        updatedAt: now,
      })
      .where(eq(urls.id, url.id));

    // const [updated] = await db
    //   .update(urls)
    //   .set({
    //     clicks: sql`${urls.clicks} + 1`,
    //     updatedAt: now,
    //   })
    //   .where(eq(urls.id, url.id))
    //   .returning({ clicks: urls.clicks });

    // non-blocking, fire and forget
    void (async () => {
      await db
        .insert(clickEvents)
        .values({
          urlId: url.id,
          clickedAt: now,
          userId: url.userId,
          browser: userAgentParsed?.browser.name,
          platform: userAgentParsed?.os.name,
        })
        .catch((e) => {
          console.error("Failed to log clickEvent:", e);
        });
    })();

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error in recordClickEvent:", error);
    return {
      success: false,
      error: "An error occurred while recording the click",
    };
  }
}
