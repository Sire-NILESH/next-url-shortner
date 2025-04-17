"use server";

import { auth } from "@/server/auth";
import { db, eq } from "@/server/db";
import { urls, urlStatusEnum } from "@/server/db/schema";
import { ApiResponse, UrlStatusTypeEnum } from "@/types/server/types";
import { revalidatePath } from "next/cache";

export async function updateUrlStatus(
  urlId: number,
  status: UrlStatusTypeEnum
): Promise<ApiResponse<null>> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "You need to be logged in to perform this action",
      };
    }

    if (session?.user?.role !== "admin") {
      return {
        success: false,
        error: "You are not unauthorized to perform this action",
      };
    }

    if (!urlStatusEnum.enumValues.includes(status)) {
      return {
        success: false,
        error: "Invalid status",
      };
    }

    const urlToManage = await db.query.urls.findFirst({
      where: (urls, { eq }) => eq(urls.id, urlId),
    });

    if (!urlToManage) {
      return { success: false, error: "URL not found" };
    }

    await db
      .update(urls)
      .set({
        status,
      })
      .where(eq(urls.id, urlId));

    revalidatePath("/admin/urls");
    revalidatePath("/admin/urls/flagged");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error managing flagged URL", error);
    return { success: false, error: "Internal server error" };
  }
}
