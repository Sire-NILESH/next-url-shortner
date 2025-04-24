import "server-only";

import { db, desc, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { UserUrl } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
import { sql } from "drizzle-orm";

export async function getUserUrlsByUserId(
  userId: string
): Promise<ApiResponse<Array<UserUrl>>> {
  try {
    // Get all URLs for the user
    const results = await db
      .select({
        id: urls.id,
        originalUrl: urls.originalUrl,
        shortCode: urls.shortCode,
        name: urls.name,
        clicks: urls.clicks,
        createdAt: urls.createdAt,
        threat: urls.threat,
        flagged: urls.flagged,
        flagCategory: urls.flagCategory,
        disabled: sql<boolean>`(${urls.status} = 'inactive' OR ${urls.status} = 'suspended')`,
      })
      .from(urls)
      .where(eq(urls.userId, userId))
      .orderBy(desc(urls.createdAt));

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Error getting user URLs in getUserUrlsByUserId", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
