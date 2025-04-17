"use server";

import { auth } from "@/server/auth";
import { db, eq } from "@/server/db";
import { users, userStatusEnum } from "@/server/db/schema";
import { ApiResponse, UserStatusTypeEnum } from "@/types/server/types";
// import { revalidatePath } from "next/cache";

export async function updateUserStatus(
  userId: string,
  status: UserStatusTypeEnum
): Promise<ApiResponse<null>> {
  try {
    // Verify authentication and admin role
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (session.user.role !== "admin") {
      return {
        success: false,
        error: "Insufficient permissions",
      };
    }

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

    //  revalidatePath("/admin/users");

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
