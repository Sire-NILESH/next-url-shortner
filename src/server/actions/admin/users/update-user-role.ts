"use server";

import { db, eq } from "@/server/db";
import { userRoleEnum, users } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse, UserRoleTypeEnum } from "@/types/server/types";
// import { revalidatePath } from "next/cache";

export async function updateUserRole(
  userId: string,
  role: UserRoleTypeEnum
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest({
      allowedRoles: ["admin"],
    });

    if (!authResponse.success) return authResponse;

    const { data: session } = authResponse;

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

    // revalidatePath("/admin/users");

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
