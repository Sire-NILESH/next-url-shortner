"use server";

import { db } from "@/server/db";
import { urls, users } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import {
  ApiResponse,
  FlagCategoryTypeEnum,
  ThreatTypeEnum,
  UrlStatusTypeEnum,
  UserRoleTypeEnum,
} from "@/types/server/types";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  isNull,
  isNotNull,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import {
  threatTypeEnum,
  urlStatusEnum,
  flagCategoryEnum,
} from "@/server/db/schema";

export type UrlWithUser = {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: UserRoleTypeEnum;
  flagged: boolean;
  flagCategory: FlagCategoryTypeEnum;
  flagReason: string | null;
  threat: ThreatTypeEnum;
  status: UrlStatusTypeEnum;
};

const getAllUrlsOptionsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z
    .enum([
      "originalUrl",
      "shortCode",
      "createdAt",
      "clicks",
      "userName",
      "threat",
      "flagCategory",
      "status",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  filter: z.enum(["all", "flagged", "security", "caution", "safe"]).optional(),
  threats: z.array(z.enum(threatTypeEnum.enumValues)).nullable().optional(),
  statuses: z.array(z.enum(urlStatusEnum.enumValues)).nullable().optional(),
  categories: z
    .array(z.enum(flagCategoryEnum.enumValues))
    .nullable()
    .optional(),
});

export type GetAllUrlsOptions = z.infer<typeof getAllUrlsOptionsSchema>;

export async function getAllUrls(
  options: GetAllUrlsOptions = {}
): Promise<ApiResponse<{ urls: UrlWithUser[]; total: number }>> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsed = getAllUrlsOptionsSchema.safeParse(options);

    if (!parsed.success) {
      return { success: false, error: "Invalid query parameters" };
    }

    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      filter = "all",
      threats = [],
      statuses = [],
      categories = [],
    } = parsed.data;

    const offset = (page - 1) * limit;

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
        conditions.push(isNotNull(urls.threat));
      } else if (filter === "caution") {
        conditions.push(and(eq(urls.flagged, true), isNull(urls.threat)));
      } else if (filter === "safe") {
        conditions.push(and(isNull(urls.threat), eq(urls.flagged, false)));
      }
    }

    // Threats filter
    if (threats && threats.length > 0) {
      conditions.push(
        or(
          ...threats.map((threat) => {
            if (threat) {
              return eq(urls.threat, threat);
            }
          })
        )
      );
    }

    // Statuses filter
    if (statuses && statuses.length > 0) {
      conditions.push(or(...statuses.map((status) => eq(urls.status, status))));
    }

    // Categories filter
    if (categories && categories.length > 0) {
      conditions.push(
        or(
          ...categories.map((category) => {
            if (category) {
              return eq(urls.flagCategory, category);
            }
          })
        )
      );
    }

    // Count query
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
        userRole: sql<UserRoleTypeEnum>`COALESCE(${users.role}, NULL)`.as(
          "userRole"
        ),
        flagged: urls.flagged,
        flagReason: urls.flagReason,
        flagCategory: urls.flagCategory,
        threat: urls.threat,
        status: urls.status,
      })
      .from(urls)
      .leftJoin(users, eq(urls.userId, users.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);

    // Sorting
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
