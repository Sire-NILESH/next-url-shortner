import { userUrlsCache } from "@/server/redis/cache/urls/user-urls-cache";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { getUserUrlsByUserId } from "@/server/services/url/get-user-urls-by-userid.service";
import { UserUrl } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
import { NextRequest } from "next/server";

type ResponseType = ApiResponse<UserUrl[]>;

export async function GET(req: NextRequest) {
  try {
    const authResponse = await authorizeRequest();

    if (!authResponse.success)
      return Response.json(authResponse satisfies ResponseType);

    const userId = authResponse.data.user.id;

    // Check redis cache
    const cacheData = await userUrlsCache.get(userId);

    if (cacheData) {
      const response = {
        success: true,
        data: cacheData.urls,
      };
      return Response.json(response satisfies ResponseType);
    }

    // Get all URLs for the user
    const dbData = await getUserUrlsByUserId(userId);

    // Create a redis cache entry
    await userUrlsCache.set(userId, {
      userId,
      urls: dbData.success ? dbData.data : [],
    });

    return Response.json(dbData satisfies ResponseType);
  } catch (error) {
    console.error(`Error in : ${req.nextUrl.pathname}`, error);
    return Response.json({
      success: false,
      error: "Internal Server Error",
    } satisfies ResponseType);
  }
}
