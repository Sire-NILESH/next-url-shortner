import "server-only";

import timeRanges from "@/lib/timeRanges";
import { db } from "@/server/db";
import { ApiResponse } from "@/types/server/types";
import { add, sub } from "date-fns";
import { sql } from "drizzle-orm";

type TimeRange = keyof typeof timeRanges | "all time";

interface GetUrlVsFlaggedChartDataOptions {
  timeRange?: TimeRange | null;
}

export const getUrlVsFlaggedChartData = async (
  options: GetUrlVsFlaggedChartDataOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<
    {
      period: string;
      urls: number;
      flaggedUrls: number;
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
        fromDate = new Date(2023, 0);
        now = add(now, { years: 1 });
        interval = "1 year";
        format = "YYYY";
        break;
    }

    const result = await db.execute<{
      period: string;
      urls: number;
      flaggedUrls: number;
    }>(sql`
      WITH periods AS (
        SELECT generate_series(
          ${fromDate.toISOString()}::timestamp,
          ${now.toISOString()}::timestamp,
          INTERVAL '${sql.raw(interval)}'
        ) AS period
      ),
      url_counts AS (
        SELECT
          date_trunc(${sql.raw(
            `'${interval.split(" ")[1]}'`
          )}, "created_at") AS grouped,
          COUNT(*) AS urls,
          COUNT(*) FILTER (WHERE "flagged" = true) AS flagged
        FROM urls
        WHERE "created_at" >= ${fromDate.toISOString()}::timestamp
        GROUP BY grouped
      )
      SELECT 
        TO_CHAR(p.period, '${sql.raw(format)}') AS period,
        COALESCE(u.urls, 0)::int AS urls,
        COALESCE(u.flagged, 0)::int AS "flaggedUrls"
      FROM periods p
      LEFT JOIN url_counts u
        ON date_trunc(${sql.raw(
          `'${interval.split(" ")[1]}'`
        )}, p.period) = u.grouped
      ORDER BY p.period;
    `);

    return {
      success: true,
      data: result ?? [],
    };
  } catch (error) {
    console.error("Error fetching getUrlVsFlaggedChartData:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
