"use server";

import timeRanges from "@/lib/timeRanges";
import { TimeRangeSchema } from "@/lib/validations/TimeRangeSchema";
import { db } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

const getTotalFlaggedUrlStatsOptionsSchema = z.object({
  timeRange: TimeRangeSchema.nullable().optional(),
});

export type GetTotalFlaggedUrlStatsOptions = z.infer<
  typeof getTotalFlaggedUrlStatsOptionsSchema
>;

export const getTotalFlaggedUrlStat = async (
  options: GetTotalFlaggedUrlStatsOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<{
    totalFlaggedUrls: number;
  }>
> => {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsed = getTotalFlaggedUrlStatsOptionsSchema.safeParse(options);

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
        urls.createdAt
      } >= NOW() - INTERVAL '${sql.raw(timeRanges[optionsParsed.timeRange])}'`;
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
