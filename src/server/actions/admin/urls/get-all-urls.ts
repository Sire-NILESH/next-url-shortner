"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { and, asc, desc, eq, ilike, isNotNull, or, sql } from "drizzle-orm";
import { urls, users } from "@/server/db/schema";
import { ApiResponse } from "@/types/server/types";

export type UrlWithUser = {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: "user" | "admin" | null;
  flagged: boolean;
  flagReason: string | null;
};

type GetAllUrlsOptions = {
  page?: number;
  limit?: number;
  sortBy?: "originalUrl" | "shortCode" | "createdAt" | "clicks" | "userName";
  sortOrder?: "asc" | "desc";
  search?: string;
  filter?: "all" | "flagged" | "security" | "inappropriate" | "other";
};

export async function getAllUrls(
  options: GetAllUrlsOptions = {}
): Promise<ApiResponse<{ urls: UrlWithUser[]; total: number }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      filter = "all",
    } = options;

    const offset = (page - 1) * limit;

    // Base conditions
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          ilike(urls.originalUrl, `%${search}%`),
          ilike(urls.shortCode, `%${search}%`),
          ilike(urls.flagReason, `%${search}%`),
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    // Filter conditions
    if (filter !== "all") {
      if (filter === "flagged") {
        conditions.push(eq(urls.flagged, true));
      } else if (filter === "security") {
        conditions.push(
          or(
            ilike(urls.flagReason, "%security%"),
            ilike(urls.flagReason, "%phishing%"),
            ilike(urls.flagReason, "%malware%")
          )
        );
      } else if (filter === "inappropriate") {
        conditions.push(
          or(
            ilike(urls.flagReason, "%inappropriate%"),
            ilike(urls.flagReason, "%adult%"),
            ilike(urls.flagReason, "%offensive%")
          )
        );
      } else if (filter === "other") {
        conditions.push(
          and(
            isNotNull(urls.flagReason),
            sql`NOT (${urls.flagReason} ILIKE '%security%')`,
            sql`NOT (${urls.flagReason} ILIKE '%phishing%')`,
            sql`NOT (${urls.flagReason} ILIKE '%malware%')`,
            sql`NOT (${urls.flagReason} ILIKE '%inappropriate%')`,
            sql`NOT (${urls.flagReason} ILIKE '%adult%')`,
            sql`NOT (${urls.flagReason} ILIKE '%offensive%')`
          )
        );
      }
    }

    // Count query for pagination
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(urls)
      .leftJoin(users, eq(urls.userId, users.id))
      .where(conditions.length ? and(...conditions) : undefined);

    // Main query
    const query = db
      .select({
        id: urls.id,
        originalUrl: urls.originalUrl,
        shortCode: urls.shortCode,
        createdAt: urls.createdAt,
        clicks: urls.clicks,
        userId: urls.userId,
        userName: sql<string | null>`COALESCE(${users.name}, NULL)`.as(
          "userName"
        ),
        userEmail: sql<string | null>`COALESCE(${users.email}, NULL)`.as(
          "userEmail"
        ),
        userRole: sql<
          "user" | "admin" | null
        >`COALESCE(${users.role}, NULL)`.as("userEmail"),
        flagged: urls.flagged,
        flagReason: urls.flagReason,
      })
      .from(urls)
      .leftJoin(users, eq(urls.userId, users.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);

    // Apply sorting
    if (sortBy === "userName") {
      query.orderBy(sortOrder === "asc" ? asc(users.name) : desc(users.name));
    } else {
      query.orderBy(
        sortOrder === "asc" ? asc(urls[sortBy]) : desc(urls[sortBy])
      );
    }

    const [countResult, urlResults] = await Promise.all([countQuery, query]);

    return {
      success: true,
      data: {
        urls: urlResults,
        total: countResult[0].count,
      },
    };
  } catch (error) {
    console.error("Error getting all URLs:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
