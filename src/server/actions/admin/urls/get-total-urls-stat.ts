"use server";

import timeRanges from "@/lib/timeRanges";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { urls } from "@/server/db/schema";
import { ApiResponse } from "@/types/server/types";
import { sql } from "drizzle-orm";

type TimeRange = keyof typeof timeRanges | "all time";

interface GetTotalUrlStatOptions {
  timeRange?: TimeRange;
}

export const getTotalUrlStat = async (
  options: GetTotalUrlStatOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<{
    totalUrls: number;
  }>
> => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    let whereCondition;
    if (
      options.timeRange &&
      options.timeRange !== "all time" &&
      options.timeRange in timeRanges
    ) {
      // Fixed: Use sql.raw() for the interval value
      whereCondition = sql`${urls.createdAt} >= NOW() - INTERVAL '${sql.raw(
        timeRanges[options.timeRange]
      )}'`;
    }

    const urlsResponse = await db
      .select({
        count: sql<number>`COUNT(${urls.id})`.mapWith(Number),
      })
      .from(urls)
      .where(whereCondition);

    return {
      success: true,
      data: {
        totalUrls: urlsResponse[0]?.count ?? 0,
      },
    };
  } catch (error) {
    console.error("Error fetching getTotalUrlStat:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
