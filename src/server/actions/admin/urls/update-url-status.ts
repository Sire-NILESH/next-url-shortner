"use server";

import { db, eq } from "@/server/db";
import { urls, urlStatusEnum } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse, UrlStatusTypeEnum } from "@/types/server/types";
import { revalidatePath } from "next/cache";

export async function updateUrlStatus(
  urlId: number,
  status: UrlStatusTypeEnum
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

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
