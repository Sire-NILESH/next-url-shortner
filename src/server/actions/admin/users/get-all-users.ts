"use server";

import { db } from "@/server/db";
import { accounts, urls, users } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";

export type UserWithoutPassword = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  image: string | null;
  urlCount: number;
  flaggedUrlCount: number;
  providerType: string | null;
};

export type GetAllUsersOptions = {
  page?: number;
  limit?: number;
  sortBy?:
    | "name"
    | "email"
    | "role"
    | "status"
    | "createdAt"
    | "urlCount"
    | "flaggedUrlCount"
    | "providerType";
  sortOrder?: "asc" | "desc";
  search?: string;
};

export async function getAllUsers(
  options: GetAllUsersOptions = {}
): Promise<ApiResponse<{ users: UserWithoutPassword[]; total: number }>> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
    } = options;

    const offset = (page - 1) * limit;

    // Base conditions
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          ilike(users.id, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.name, `%${search}%`)
        )
      );
    }

    // Count query with DISTINCT to handle joins correctly
    const countQuery = db
      .select({ count: sql<number>`count(distinct ${users.id})` })
      .from(users)
      .leftJoin(urls, eq(users.id, urls.userId))
      .where(conditions.length ? and(...conditions) : undefined);

    // Sorting field selection
    const sortingField =
      sortBy === "urlCount"
        ? sql<number>`COUNT(${urls.id})`
        : sortBy === "flaggedUrlCount"
        ? sql<number>`SUM(CASE WHEN ${urls.flagged} = true THEN 1 ELSE 0 END)`
        : sortBy === "providerType"
        ? sql<string>`COALESCE(MIN(${accounts.provider}), 'email')`
        : users[sortBy as keyof typeof users.$inferSelect];

    // Main query
    const query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
        image: users.image,
        urlCount: sql<number>`COUNT(${urls.id})`.as("urlCount"),
        flaggedUrlCount:
          sql<number>`SUM(CASE WHEN ${urls.flagged} = true THEN 1 ELSE 0 END)`.as(
            "flaggedUrlCount"
          ),
        providerType:
          sql<string>`COALESCE(MIN(${accounts.provider}), 'credentials')`.as(
            "providerType"
          ),
      })
      .from(users)
      .leftJoin(urls, eq(users.id, urls.userId))
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .where(conditions.length ? and(...conditions) : undefined)
      .groupBy(users.id)
      .orderBy(sortOrder === "asc" ? asc(sortingField) : desc(sortingField))
      .limit(limit)
      .offset(offset);

    const [countResult, userResults] = await Promise.all([countQuery, query]);

    return {
      success: true,
      data: {
        users: userResults,
        total: countResult[0].count,
      },
    };
  } catch (error) {
    console.error("Error getting all users", error);
    return { success: false, error: "Error getting all users" };
  }
}
