"use server";

import { db, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { redirectUrlCache } from "@/server/redis/cache/urls/redirect-url-cache";
import { userUrlsCache } from "@/server/redis/cache/urls/user-urls-cache";
import { applyRateLimit } from "@/server/redis/ratelimiter";
import { redis } from "@/server/redis/redis";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { z } from "zod";

const deleteUrlSchema = z.object({
  urlId: z.number().int().positive(),
});

export type DeleteUrlParam = z.infer<typeof deleteUrlSchema>;

export async function deleteUrl(
  params: DeleteUrlParam
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest();

    if (!authResponse.success) return authResponse;

    const { data: session } = authResponse;

    // Rate limit check
    const limiterResult = await applyRateLimit({
      limiterKey: "userUrlModificatonsRateLimit",
    });

    if (!limiterResult?.success) {
      return {
        success: false,
        error: "Too many requests, please try again later.",
      };
    }

    const parsed = deleteUrlSchema.safeParse(params);

    if (!parsed.success) {
      return { success: false, error: "Invalid params" };
    }

    const { urlId } = parsed.data;

    const [url] = await db.select().from(urls).where(eq(urls.id, urlId));

    if (!url) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    if (
      (url.userId && url.userId !== session.user.id) ||
      session.user.role !== "admin"
    ) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await db.delete(urls).where(eq(urls.id, urlId));

    await redis
      .pipeline()
      // Delete existing user urls cache data in redis
      .del(userUrlsCache.getFullKey(session.user.id))
      // Also delete this url shortcode from the redirect cache.
      .del(redirectUrlCache.getFullKey(url.shortCode))
      .exec();

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error deleting URL", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
