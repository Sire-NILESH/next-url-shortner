"use server";

import { db, eq } from "@/server/db";
import { users } from "@/server/db/schema";
import { userStatusCache } from "@/server/redis/cache/users/user-status-cache";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse, UserStatusTypeEnum } from "@/types/server/types";
import { redirect } from "next/navigation";

export async function getUserStatus(): Promise<
  ApiResponse<UserStatusTypeEnum>
> {
  try {
    const authResponse = await authorizeRequest();

    if (!authResponse.success) return redirect("/login");

    const { data: session } = authResponse;

    const userId = session.user.id;

    // Check redis cache
    const cacheData = await userStatusCache.get(userId);

    if (cacheData) {
      const response = {
        success: true,
        data: cacheData.userStatus,
      };
      return response;
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) redirect("/login");

    // Create a redis cache entry
    await userStatusCache.set(userId, {
      userId,
      userStatus: user.status,
    });

    return {
      success: true,
      data: user.status,
    };
  } catch (error) {
    // rethrow if it's a NEXT_REDIRECT error
    // redirect() throws an error with message === "NEXT_REDIRECT" and handled by NextJS and that's how redirect flows work internally.
    if (error instanceof Error && error?.message === "NEXT_REDIRECT") {
      console.error({
        "redirecting user from getUserStatus for bad status": {
          message: error.message,
        },
      });
      throw error;
    }

    console.error("Error in getUserStatus", error);
    return {
      success: false,
      error: "Something went wrong.",
    };
  }
}
