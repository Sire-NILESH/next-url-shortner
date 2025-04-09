"use server";

import timeRanges from "@/lib/timeRanges";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { urls } from "@/server/db/schema";
import { ApiResponse } from "@/types/server/types";
import { and, eq, sql } from "drizzle-orm";

type TimeRange = keyof typeof timeRanges | "all time";

interface GetTotalFlaggedUrlStatOptions {
  timeRange?: TimeRange;
}

export const getTotalFlaggedUrlStat = async (
  options: GetTotalFlaggedUrlStatOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<{
    totalFlaggedUrls: number;
  }>
> => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    let timeRangeWhereCondition;
    if (
      options.timeRange &&
      options.timeRange !== "all time" &&
      options.timeRange in timeRanges
    ) {
      timeRangeWhereCondition = sql`${
        urls.createdAt
      } >= NOW() - INTERVAL '${sql.raw(timeRanges[options.timeRange])}'`;
    }

    const conditions = [eq(urls.flagged, true)];
    if (timeRangeWhereCondition) {
      conditions.push(timeRangeWhereCondition);
    }

    const urlsResponse = await db
      .select({
        urls: sql<number>`COALESCE(COUNT(${urls.id}), '0')`,
      })
      .from(urls)
      .where(and(...conditions));

    return {
      success: true,
      data: {
        totalFlaggedUrls: urlsResponse[0].urls ?? 0,
      },
    };
  } catch (error) {
    console.error("Error fetching getTotalFlaggedUrlStat:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
