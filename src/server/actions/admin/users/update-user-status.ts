"use server";

import { db, eq } from "@/server/db";
import { users, userStatusEnum } from "@/server/db/schema";
import { userStatusCache } from "@/server/redis/cache/users/user-status-cache";
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

    const userToUpdate = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!userToUpdate) {
      return {
        success: false,
        error: "User not found",
      };
    }

    await db
      .update(users)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Delete existing user urls cache data in redis
    await userStatusCache.delete(userId); //the user id from param and not session, else it will change the status of admin itself.

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
