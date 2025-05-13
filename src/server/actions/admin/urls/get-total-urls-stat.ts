"use server";

import timeRanges from "@/lib/timeRanges";
import { TimeRangeSchema } from "@/lib/validations/TimeRangeSchema";
import { db } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { sql } from "drizzle-orm";
import { z } from "zod";

const getTotalUrlStatOptionsSchema = z.object({
  timeRange: TimeRangeSchema.nullable().optional(),
});

type GetTotalUrlStatOptions = z.infer<typeof getTotalUrlStatOptionsSchema>;

export const getTotalUrlStat = async (
  options: GetTotalUrlStatOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<{
    totalUrls: number;
  }>
> => {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsed = getTotalUrlStatOptionsSchema.safeParse(options);

    if (!parsed.success) {
      return { success: false, error: "Invalid params" };
    }

    const optionsParsed = parsed.data;

    let whereCondition;
    if (
      optionsParsed.timeRange &&
      optionsParsed.timeRange !== "all time" &&
      optionsParsed.timeRange in timeRanges
    ) {
      // Fixed: Use sql.raw() for the interval value
      whereCondition = sql`${urls.createdAt} >= NOW() - INTERVAL '${sql.raw(
        timeRanges[optionsParsed.timeRange]
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
