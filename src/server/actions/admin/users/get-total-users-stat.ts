"use server";

import timeRanges from "@/lib/timeRanges";
import { TimeRangeSchema } from "@/lib/validations/TimeRangeSchema";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { sql } from "drizzle-orm";
import { z } from "zod";

const getTotalUsersStatOptionsSchema = z.object({
  timeRange: TimeRangeSchema.nullable().optional(),
});

export type GetTotalUsersStatOptions = z.infer<
  typeof getTotalUsersStatOptionsSchema
>;

export const getTotalUsersStat = async (
  options: GetTotalUsersStatOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<{
    totalUsers: number;
  }>
> => {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsed = getTotalUsersStatOptionsSchema.safeParse(options);

    if (!parsed.success) {
      return { success: false, error: "Invalid params" };
    }

    const optionsParsed = parsed.data;

    let timeRangeWhereCondition;
    if (
      optionsParsed.timeRange &&
      optionsParsed.timeRange !== "all time" &&
      optionsParsed.timeRange in timeRanges
    ) {
      timeRangeWhereCondition = sql`${
        users.createdAt
      } >= NOW() - INTERVAL '${sql.raw(timeRanges[optionsParsed.timeRange])}'`;
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
