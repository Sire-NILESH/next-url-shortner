import "server-only";

import { db } from "@/server/db";
import { add, sub } from "date-fns";
import { sql } from "drizzle-orm";
import timeRanges from "@/lib/timeRanges";
import { ApiResponse } from "@/types/server/types";

type TimeRange = keyof typeof timeRanges | "all time";

interface GetUserGrowthChartDataOptions {
  timeRange?: TimeRange | null;
}

export const getUserGrowthChartData = async (
  options: GetUserGrowthChartDataOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<
    {
      period: string;
      users: number;
    }[]
  >
> => {
  try {
    const range = options.timeRange ?? "all time";

    let now = new Date();
    let fromDate = new Date(2000, 0);
    let interval = "1 year";
    let format = "YYYY";

    switch (range) {
      case "24H":
        fromDate = sub(now, { hours: 23 });
        interval = "1 hour";
        format = "HH12 AM";
        break;
      case "7D":
        fromDate = sub(now, { days: 6 });
        interval = "1 day";
        format = "Dy";
        break;
      case "30D":
        fromDate = sub(now, { days: 29 });
        interval = "1 day";
        format = "DD Mon";
        break;
      case "3M":
        fromDate = sub(now, { months: 2 });
        interval = "1 month";
        format = "Mon";
        break;
      case "6M":
        fromDate = sub(now, { months: 5 });
        interval = "1 month";
        format = "Mon";
        break;
      case "1Y":
        fromDate = sub(now, { months: 11 });
        interval = "1 month";
        format = "Mon YYYY";
        break;
      case "all time":
      default:
        fromDate = new Date(2023, 0);
        now = add(now, { years: 1 });
        interval = "1 year";
        format = "YYYY";
        break;
    }

    const result = await db.execute<{
      period: string;
      users: number;
    }>(sql`
    WITH periods AS (
      SELECT generate_series(
        ${fromDate.toISOString()}::timestamp,
        ${now.toISOString()}::timestamp,
        INTERVAL '${sql.raw(interval)}'
      ) AS period
    ),
    user_counts AS (
      SELECT 
        date_trunc(${sql.raw(
          `'${interval.split(" ")[1]}'`
        )}, "created_at") AS grouped,
        COUNT(*) AS count
      FROM users
      WHERE "created_at" >= ${fromDate.toISOString()}::timestamp
      GROUP BY grouped
    )
    SELECT 
      TO_CHAR(p.period, '${sql.raw(format)}') AS period,
      COALESCE(u.count, 0)::int AS users
    FROM periods p
    LEFT JOIN user_counts u
      ON date_trunc(${sql.raw(
        `'${interval.split(" ")[1]}'`
      )}, p.period) = u.grouped
    ORDER BY p.period;
  `);

    return {
      success: true,
      data: result ?? [{ period: "unknown", users: 0 }],
    };
  } catch (error) {
    console.error("Error fetching getUserGrowthChartData:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
