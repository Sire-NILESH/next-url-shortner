import "server-only";

import { db, eq } from "@/server/db";
import { users } from "@/server/db/schema";
import { ApiResponse, User } from "@/types/server/types";

type EnsureValidUserStatusOptions = {
  suspendedMessage?: string;
  inactiveRedirect?: boolean;
  inactiveRedirectPath?: string;
  inactiveMessage?: string;
};

export async function ensureValidUserStatus(
  userId: string,
  options: EnsureValidUserStatusOptions = {}
): Promise<ApiResponse<User>> {
  const {
    suspendedMessage = "Your account is suspended and cannot perform this action.",
    inactiveRedirect = true,
    inactiveRedirectPath = "/inactive-user",
    inactiveMessage = "Your account is inactive.",
  } = options;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (user.status === "suspended") {
      return {
        success: false,
        error: suspendedMessage,
      };
    }

    if (user.status === "inactive") {
      return inactiveRedirect
        ? {
            success: false,
            redirect: inactiveRedirectPath || "/inactive-user",
          }
        : {
            success: false,
            error: inactiveMessage || "Your account is inactive.",
          };
    }

    const safeUser = structuredClone(user);
    safeUser["password"] = null;

    return {
      success: true,
      data: safeUser,
    };
  } catch (error) {
    console.error("Error in ensureValidUserStatus", error);
    return {
      success: false,
      error: "An error occurred while validating user status.",
    };
  }
}
