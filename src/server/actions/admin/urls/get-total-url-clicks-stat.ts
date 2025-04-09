"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { urls } from "@/server/db/schema";
import { ApiResponse } from "@/types/server/types";
import { sql } from "drizzle-orm";

export const getTotalUrlClickStat = async (): Promise<
  ApiResponse<{
    totalUrlClicks: number;
  }>
> => {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const urlsResponse = await db
      .select({
        clicks: sql<number>`COALESCE(SUM(${urls.clicks}), '0')`,
      })
      .from(urls);

    return {
      success: true,
      data: {
        totalUrlClicks: urlsResponse[0].clicks ?? "0",
      },
    };
  } catch (error) {
    console.error("Error fetching getTotalUrlClickStat:", error);
    return { success: false, error: "Internal Server Error" };
  }
};
