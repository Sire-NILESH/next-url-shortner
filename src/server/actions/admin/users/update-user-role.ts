"use server";

import { db, eq } from "@/server/db";
import { userRoleEnum, users } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { z } from "zod";

const updateUserRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(userRoleEnum.enumValues),
});

export type updateUserRoleParams = z.infer<typeof updateUserRoleSchema>;

export async function updateUserRole(
  params: updateUserRoleParams
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest({
      allowedRoles: ["admin"],
    });

    if (!authResponse.success) return authResponse;

    const { data: session } = authResponse;

    const parsed = updateUserRoleSchema.safeParse(params);

    if (!parsed.success) {
      return { success: false, error: "Invalid params" };
    }

    const { role, userId } = parsed.data;

    // Prevent changing own role
    if (session.user.id === userId) {
      return {
        success: false,
        error: "You cannot change your own role",
      };
    }

    if (!userRoleEnum.enumValues.includes(role)) {
      return {
        success: false,
        error: "Invalid role",
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
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error: "An error occurred while updating user role",
    };
  }
}
