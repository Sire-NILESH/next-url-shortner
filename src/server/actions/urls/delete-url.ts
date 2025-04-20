"use server";

import { db, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";

export async function deleteUrl(urlId: number): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest();

    if (!authResponse.success) return authResponse;

    const { data: session } = authResponse;

    const [url] = await db.select().from(urls).where(eq(urls.id, urlId));

    if (!url) {
      return {
        success: false,
        error: "URL not found",
      };
    }

    if (url.userId && url.userId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await db.delete(urls).where(eq(urls.id, urlId));

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error("Error deleting URL", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
