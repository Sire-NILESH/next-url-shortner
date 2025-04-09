"use server";

import timeRanges from "@/lib/timeRanges";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { ApiResponse } from "@/types/server/types";
import { sql } from "drizzle-orm";

type TimeRange = keyof typeof timeRanges | "all time";

interface GetTotalUsersStatOptions {
  timeRange?: TimeRange;
}

export const getTotalUsersStat = async (
  options: GetTotalUsersStatOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<{
    totalUsers: number;
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
        users.createdAt
      } >= NOW() - INTERVAL '${sql.raw(timeRanges[options.timeRange])}'`;
    }

    const query = db
      .select({
        totalUsers: sql<number>`COALESCE(COUNT(*), '0')`,
      })
      .from(users);

    if (timeRangeWhereCondition) {
      query.where(timeRangeWhereCondition);
    }

    const usersResponse = await query;

    return {
      success: true,
      data: {
        totalUsers: usersResponse[0].totalUsers ?? 0,
      },
    };
  } catch (error) {
    console.error("Error fetching getTotalUsersStat:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
