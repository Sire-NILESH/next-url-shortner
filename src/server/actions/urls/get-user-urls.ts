"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { ApiResponse } from "@/types/server/types";

export async function getUserUrls(userId: string): Promise<
  ApiResponse<
    Array<{
      id: number;
      originalUrl: string;
      shortCode: string;
      createdAt: Date;
      clicks: number;
    }>
  >
> {
  try {
    const session = await auth();
    if (!session?.user || session.user.id !== userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get all URLs for the user
    const userUrls = await db.query.urls.findMany({
      where: (urls, { eq }) => eq(urls.userId, userId),
      orderBy: (urls, { desc }) => [desc(urls.createdAt)],
      columns: {
        id: true,
        originalUrl: true,
        shortCode: true,
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
