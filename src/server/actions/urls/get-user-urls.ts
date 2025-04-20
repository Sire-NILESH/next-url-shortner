"use server";

import { db } from "@/server/db";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";

export async function getUserUrls(userId: string): Promise<
  ApiResponse<
    Array<{
      id: number;
      originalUrl: string;
      shortCode: string;
      name: string | null;
      createdAt: Date;
      clicks: number;
    }>
  >
> {
  try {
    const authResponse = await authorizeRequest({ requireUserId: userId });

    if (!authResponse.success) return authResponse;

    // Get all URLs for the user
    const userUrls = await db.query.urls.findMany({
      where: (urls, { eq }) => eq(urls.userId, userId),
      orderBy: (urls, { desc }) => [desc(urls.createdAt)],
      columns: {
        id: true,
        originalUrl: true,
        shortCode: true,
        name: true,
        createdAt: true,
        clicks: true,
      },
    });

    return {
      success: true,
      data: userUrls,
    };
  } catch (error) {
    console.error("Error getting user URLs", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
