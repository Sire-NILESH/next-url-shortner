"use server";

import { db, eq } from "@/server/db";
import { users, userStatusEnum } from "@/server/db/schema";
import { redirectUrlCache } from "@/server/redis/cache/urls/redirect-url-cache";
import { userUrlsCache } from "@/server/redis/cache/urls/user-urls-cache";
import { userStatusCache } from "@/server/redis/cache/users/user-status-cache";
import { redis } from "@/server/redis/redis";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { z } from "zod";

const updateUserStatusSchema = z.object({
  userId: z.string().min(1),
  status: z.enum(userStatusEnum.enumValues),
});

export type UpdateUserStatusParams = z.infer<typeof updateUserStatusSchema>;

export async function updateUserStatus(
  params: UpdateUserStatusParams
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest({
      allowedRoles: ["admin"],
    });

    if (!authResponse.success) return authResponse;

    const { data: session } = authResponse;

    const parsed = updateUserStatusSchema.safeParse(params);

    if (!parsed.success) {
      return { success: false, error: "Invalid params" };
    }

    const { status, userId } = parsed.data;

    // Prevent changing own status
    if (session.user.id === userId) {
      return {
        success: false,
        error: "You cannot change your own status",
      };
    }

    if (!userStatusEnum.enumValues.includes(status)) {
      return {
        success: false,
        error: "Invalid status",
      };
    }

    const updateResult = await db
      .update(users)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ userId: users.id });

    if (updateResult.length == 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    await redis
      .pipeline()
      // Also delete this url shortcode from the redirect cache.
      .del(userStatusCache.getFullKey(updateResult[0].userId))
      // Delete existing user urls cache data in redis
      .del(userUrlsCache.getFullKey(updateResult[0].userId))
      .exec();

    // Important: Delete all cached URL shortCodes of this user.
    await redirectUrlCache.deleteAllCacheUrlShortCodesByUserId(
      updateResult[0].userId
    );

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      error: "An error occurred while updating user status",
    };
  }
}
