import "server-only";

import { ApiResponse, UserRoleTypeEnum } from "@/types/server/types";
import { Session } from "next-auth";
import getUserSession from "./getUserSession";

type AuthorizeRequestOptions = {
  provideSession?: Session;
  requireUserId?: string;
  allowedRoles?: UserRoleTypeEnum[];
  allowOverrideRole?: UserRoleTypeEnum;
  redirectToLogin?: boolean;
};

export async function authorizeRequest({
  provideSession,
  requireUserId,
  allowedRoles,
  allowOverrideRole,
}: AuthorizeRequestOptions = {}): Promise<ApiResponse<Session>> {
  try {
    const session = provideSession ?? (await getUserSession());

    if (!session?.user) {
      return {
        success: false,
        error: "You need to be logged in to your account",
      };
    }

    const { user } = session;

    // Check userId match OR override role
    if (
      requireUserId &&
      user.id !== requireUserId &&
      user.role !== allowOverrideRole
    ) {
      return {
        success: false,
        error: "You're not authorized to perform this action",
      };
    }

    // Check if user's role is in the allowedRoles (if provided)
    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
      return {
        success: false,
        error: "You're not authorized to perform this action",
      };
    }

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Error in authorizeRequest", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}
