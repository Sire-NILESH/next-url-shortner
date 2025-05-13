import "server-only";

import timeRanges from "@/lib/timeRanges";
import { db } from "@/server/db";
import { ApiResponse } from "@/types/server/types";
import { add, sub } from "date-fns";
import { sql } from "drizzle-orm";

type TimeRange = keyof typeof timeRanges | "all time";

interface GetClicksVsFlaggedChartDataOptions {
  timeRange?: TimeRange | null;
}

export const getClicksVsFlaggedChartData = async (
  options: GetClicksVsFlaggedChartDataOptions = { timeRange: "6M" }
): Promise<
  ApiResponse<
    {
      period: string;
      clicks: number;
      flaggedClicks: number;
    }[]
  >
> => {
  try {
    const range = options.timeRange ?? "6M";
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
        fromDate = sub(now, { years: 1 });
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
      clicks: number;
      flaggedClicks: number;
    }>(sql`
      WITH periods AS (
        SELECT generate_series(
          ${fromDate.toISOString()}::timestamp,
          ${now.toISOString()}::timestamp,
          INTERVAL '${sql.raw(interval)}'
        ) AS period
      ),
      click_counts AS (
        SELECT
          date_trunc(${sql.raw(
            `'${interval.split(" ")[1]}'`
          )}, ce."clicked_at") AS grouped,
          COUNT(*) AS clicks,
          COUNT(*) FILTER (
            WHERE u."flagged" = true
          ) AS flagged
        FROM click_events ce
        INNER JOIN urls u ON u.id = ce.url_id
        WHERE ce."clicked_at" >= ${fromDate.toISOString()}::timestamp
        GROUP BY grouped
      )
      SELECT 
        TO_CHAR(p.period, '${sql.raw(format)}') AS period,
        COALESCE(c.clicks, 0)::int AS clicks,
        COALESCE(c.flagged, 0)::int AS "flaggedClicks"
      FROM periods p
      LEFT JOIN click_counts c
        ON date_trunc(${sql.raw(
          `'${interval.split(" ")[1]}'`
        )}, p.period) = c.grouped
      ORDER BY p.period;
    `);

    return {
      success: true,
      data: result ?? [],
    };
  } catch (error) {
    console.error("Error fetching getClicksVsFlaggedChartData:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
