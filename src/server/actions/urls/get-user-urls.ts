"use server";

import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { getUserUrlsByUserId } from "@/server/services/url/get-user-urls-by-userid.service";
import { UserUrl } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";

export async function getUserUrls(
  userId: string
): Promise<ApiResponse<Array<UserUrl>>> {
  try {
    const authResponse = await authorizeRequest({ requireUserId: userId });

    if (!authResponse.success) return authResponse;

    // Get all URLs for the user
    const resultsResponse = await getUserUrlsByUserId(userId);

    return resultsResponse;
  } catch (error) {
    console.error("Error getting user URLs", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
