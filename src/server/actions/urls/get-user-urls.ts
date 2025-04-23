"use server";

import { db, desc, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import {
  ApiResponse,
  FlagCategoryTypeEnum,
  ThreatTypeEnum,
} from "@/types/server/types";
import { sql } from "drizzle-orm";

export async function getUserUrls(userId: string): Promise<
  ApiResponse<
    Array<{
      id: number;
      originalUrl: string;
      shortCode: string;
      name: string | null;
      threat: ThreatTypeEnum;
      flagged: boolean;
      flagCategory: FlagCategoryTypeEnum;
      createdAt: Date;
      clicks: number;
      disabled: boolean;
    }>
  >
> {
  try {
    const authResponse = await authorizeRequest({ requireUserId: userId });

    if (!authResponse.success) return authResponse;

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
    console.error("Error getting user URLs", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
