"use server";

import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { getUserUrlsByUserId } from "@/server/services/url/get-user-urls-by-userid.service";
import { UserUrl } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
import { z } from "zod";

const getUserUrlsSchema = z.object({
  userId: z.string().min(1),
});

export type GetUserUrlsParams = z.infer<typeof getUserUrlsSchema>;

export async function getUserUrls(
  params: GetUserUrlsParams
): Promise<ApiResponse<Array<UserUrl>>> {
  try {
    const parsed = getUserUrlsSchema.safeParse(params);

    if (!parsed.success) {
      return { success: false, error: "Invalid params" };
    }

    const { userId } = parsed.data;

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
