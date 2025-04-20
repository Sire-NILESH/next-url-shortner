"use server";

import { db, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { revalidatePath } from "next/cache";

type Action = "approve" | "delete";

export async function manageFlaggedUrl(
  urlId: number,
  action: Action
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const urlToManage = await db.query.urls.findFirst({
      where: (urls, { eq }) => eq(urls.id, urlId),
    });

    if (!urlToManage) {
      return { success: false, error: "URL not found" };
    }

    if (action === "approve") {
      await db
        .update(urls)
        .set({
          flagged: false,
          flagReason: null,
          updatedAt: new Date(),
        })
        .where(eq(urls.id, urlId));
    } else if (action === "delete") {
      await db.delete(urls).where(eq(urls.id, urlId));
    } else {
      return { success: false, error: "Invalid action" };
    }

    revalidatePath("/admin/urls");
    revalidatePath("/admin/urls/flagged");

    return { success: true, data: null };
  } catch (error) {
    console.error("Error managing flagged URL", error);
    return { success: false, error: "Internal server error" };
  }
}
