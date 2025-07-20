import "server-only";

import { db, desc, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { ApiResponse, UserUrlShortCode } from "@/types/server/types";

export async function getUserUrlShortCodesByUserId(
  userId: string
): Promise<ApiResponse<Array<UserUrlShortCode>>> {
  try {
    // Get all URLs for the user
    const results = await db
      .select({
        urlId: urls.id,
        shortCode: urls.shortCode,
      })
      .from(urls)
      .where(eq(urls.userId, userId))
      .orderBy(desc(urls.createdAt));

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error(
      "Error getting user URLs shortCodes in getUserUrlShortCodesByUserId",
      error
    );
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
