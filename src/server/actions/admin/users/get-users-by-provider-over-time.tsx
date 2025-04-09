"use server";

import timeRanges from "@/lib/timeRanges";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { accounts, users } from "@/server/db/schema";
import { ApiResponse } from "@/types/server/types";
import { add, sub } from "date-fns";
import { count, eq, gte, sql } from "drizzle-orm";

type TimeRange = keyof typeof timeRanges | "all time";

interface GetUsersByProviderOptions {
  timeRange?: TimeRange;
}

export const getUsersByProviderOverTime = async (
  options: GetUsersByProviderOptions = { timeRange: "all time" }
): Promise<
  ApiResponse<
    {
      providerType: string;
      users: number;
    }[]
  >
> => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const range = options.timeRange ?? "all time";
    let now = new Date();
    let fromDate = new Date(2000, 0);

    switch (range) {
      case "24H":
        fromDate = sub(now, { hours: 23 });
        break;
      case "7D":
        fromDate = sub(now, { days: 6 });
        break;
      case "30D":
        fromDate = sub(now, { days: 29 });
        break;
      case "3M":
        fromDate = sub(now, { months: 2 });
        break;
      case "6M":
        fromDate = sub(now, { months: 5 });
        break;
      case "1Y":
        fromDate = sub(now, { years: 1 });
        break;
      case "all time":
        fromDate = new Date(2023, 0);
        now = add(now, { years: 1 });
        break;
    }

    const result = await db
      .select({
        providerType: sql<string>`COALESCE(${accounts.provider}, 'credentials')`,
        users: count(users.id),
      })
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .where(gte(users.createdAt, fromDate))
      .groupBy(accounts.provider);

    return {
      success: true,
      data:
        result && result.length > 0
          ? result
          : // Hack to overcome pie chart not showing up for 0 values
            [{ providerType: "None", users: 1 }],
    };
  } catch (error) {
    console.error("Error fetching getUsersByProviderOverTime:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
