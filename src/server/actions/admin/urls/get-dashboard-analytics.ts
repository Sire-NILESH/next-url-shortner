"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { accounts, urls, users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { ApiResponse } from "@/types/server/types";

interface TimeFrame {
  startDate: Date;
  endDate: Date;
}

export async function getMonthlyClicksVsFlaggedClicksData({
  startDate,
  endDate,
}: TimeFrame): Promise<
  ApiResponse<{ month: string; clicks: number; flaggedClicks: number }[]>
> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${urls.createdAt}, 'Month')`.as("month"),
        clicks: sql<number>`SUM(${urls.clicks})`.as("clicks"),
        flaggedClicks:
          sql<number>`SUM(CASE WHEN ${urls.flagged} THEN ${urls.clicks} ELSE 0 END)`.as(
            "flaggedClicks"
          ),
      })
      .from(urls)
      .where(sql`${urls.createdAt} BETWEEN ${startDate} AND ${endDate}`)
      .groupBy(sql`month`)
      .orderBy(sql`MIN(${urls.createdAt})`);

    return {
      success: true,
      data: result || [],
    };
  } catch (error) {
    console.error(
      "Error fetching monthly clicks vs flagged clicks data:",
      error
    );
    return { success: false, error: "Internal Server Error" };
  }
}

// clicks and urls are string and not numbers because they can get too big for js Number.
export const getAllClicksAndUrlsCount = async (): Promise<
  ApiResponse<{ clicks: string; urls: string }>
> => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const [result] = await db
      .select({
        clicks: sql<string>`COALESCE(SUM(${urls.clicks})::text, '0')`,
        urls: sql<string>`COUNT(*)::text`,
      })
      .from(urls);

    return {
      success: true,
      data: {
        clicks: result?.clicks ?? "0",
        urls: result?.urls ?? "0",
      },
    };
  } catch (error) {
    console.error("Error fetching all clicks and URLs count:", error);
    return { success: false, error: "Internal Server Error" };
  }
};

export const getDashboardStats = async (): Promise<
  ApiResponse<{
    clicks: string;
    urls: string;
    totalUsers: string;
    usersByProvider: { provider: string; users: string }[];
  }>
> => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const [[totals], usersByProvider] = await Promise.all([
      // Transaction for related stats
      db.transaction(async (tx) => {
        const [urlStats, userCount] = await Promise.all([
          tx
            .select({
              clicks: sql<string>`COALESCE(CAST(SUM(${urls.clicks}) AS TEXT), '0')`,
              urls: sql<string>`COALESCE(CAST(COUNT(${urls.id}) AS TEXT), '0')`,
            })
            .from(urls),
          tx
            .select({
              totalUsers: sql<string>`COALESCE(CAST(COUNT(*) AS TEXT), '0')`,
            })
            .from(users),
        ]);

        return [
          {
            clicks: urlStats[0]?.clicks ?? "0",
            urls: urlStats[0]?.urls ?? "0",
            totalUsers: userCount[0]?.totalUsers ?? "0",
          },
        ];
      }),

      // Provider stats query
      db
        .select({
          provider: sql<string>`COALESCE(${accounts.provider}, 'credentials')`,
          users: sql<string>`COALESCE(CAST(COUNT(${users.id}) AS TEXT), '0')`,
        })
        .from(users)
        .leftJoin(accounts, eq(users.id, accounts.userId))
        .groupBy(accounts.provider),
    ]);

    return {
      success: true,
      data: {
        clicks: totals.clicks,
        urls: totals.urls,
        totalUsers: totals.totalUsers,
        usersByProvider: usersByProvider ?? [],
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
