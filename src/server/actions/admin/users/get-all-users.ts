"use server";

import { db } from "@/server/db";
import {
  accounts,
  urls,
  userRoleEnum,
  users,
  userStatusEnum,
} from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { and, asc, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";

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

const getAllUsersOptionsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z
    .enum([
      "name",
      "email",
      "role",
      "status",
      "createdAt",
      "urlCount",
      "flaggedUrlCount",
      "providerType",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  roles: z.array(z.enum(userRoleEnum.enumValues)).nullable().optional(),
  statuses: z.array(z.enum(userStatusEnum.enumValues)).nullable().optional(),
  providers: z
    .array(z.enum(["google", "credentials"]))
    .nullable()
    .optional(),
});

export type GetAllUsersOptions = z.infer<typeof getAllUsersOptionsSchema>;

export async function getAllUsers(
  options: GetAllUsersOptions = {}
): Promise<ApiResponse<{ users: UserWithoutPassword[]; total: number }>> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsed = getAllUsersOptionsSchema.safeParse(options);

    if (!parsed.success) {
      return { success: false, error: "Invalid query parameters" };
    }

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      roles = [],
      statuses = [],
      providers = [],
    } = parsed.data;

    const offset = (page - 1) * limit;
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

    // Roles filter
    if (roles && roles.length > 0) {
      conditions.push(or(...roles.map((role) => eq(users.role, role))));
    }

    // Statuses filter
    if (statuses && statuses.length > 0) {
      conditions.push(
        or(...statuses.map((status) => eq(users.status, status)))
      );
    }

    // Providers filter
    let providerCondition;
    if (providers && providers.length > 0) {
      providerCondition = or(
        ...providers.map((p) => {
          if (p === "credentials") return isNull(accounts.provider);
          return eq(accounts.provider, p);
        })
      );
    }

    // Sorting field
    const sortingField =
      sortBy === "urlCount"
        ? sql<number>`COUNT(${urls.id})`
        : sortBy === "flaggedUrlCount"
        ? sql<number>`SUM(CASE WHEN ${urls.flagged} = true THEN 1 ELSE 0 END)`
        : sortBy === "providerType"
        ? sql<string>`COALESCE(MIN(${accounts.provider}), 'credentials')`
        : users[sortBy as keyof typeof users.$inferSelect];

    // Count query
    const countQuery = db
      .select({ count: sql<number>`COUNT(DISTINCT ${users.id})` })
      .from(users)
      .leftJoin(urls, eq(users.id, urls.userId))
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .where(
        and(
          ...(conditions.length ? [and(...conditions)] : []),
          ...(providerCondition ? [providerCondition] : [])
        )
      );

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
        flaggedUrlCount: sql<number>`
          SUM(CASE WHEN ${urls.flagged} = true THEN 1 ELSE 0 END)
        `.as("flaggedUrlCount"),
        providerType: sql<string>`
          COALESCE(MIN(${accounts.provider}), 'credentials')
        `.as("providerType"),
      })
      .from(users)
      .leftJoin(urls, eq(users.id, urls.userId))
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .where(
        and(
          ...(conditions.length ? [and(...conditions)] : []),
          ...(providerCondition ? [providerCondition] : [])
        )
      )
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
