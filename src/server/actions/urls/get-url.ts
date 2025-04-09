"use server";

import { db, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { ApiResponse } from "@/types/server/types";
import { sql } from "drizzle-orm";

export async function getUrlByShortCode(shortCode: string): Promise<
  ApiResponse<{
    originalUrl: string;
    flagged?: boolean;
    flagReason?: string | null;
  }>
> {
  try {
    const [updatedUrl] = await db
      .update(urls)
      .set({
        clicks: sql`${urls.clicks} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(urls.shortCode, shortCode))
      .returning({
        originalUrl: urls.originalUrl,
        flagged: urls.flagged,
        flagReason: urls.flagReason,
      });

    if (!updatedUrl) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    return {
      success: true,
      data: {
        originalUrl: updatedUrl.originalUrl,
        flagged: updatedUrl.flagged || false,
        flagReason: updatedUrl.flagReason || null,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while fetching the URL",
    };
  }
}
