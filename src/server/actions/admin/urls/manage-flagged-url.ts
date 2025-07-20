"use server";

import { db, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const manageFlaggedUrlSchema = z.object({
  urlId: z.number().int().positive(),
  action: z.enum(["approve", "delete"]),
});

export type ManageFlaggedUrlInput = z.infer<typeof manageFlaggedUrlSchema>;

export async function manageFlaggedUrl(
  params: ManageFlaggedUrlInput
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsed = manageFlaggedUrlSchema.safeParse(params);

    if (!parsed.success) {
      return { success: false, error: "Invalid command" };
    }

    const { urlId, action } = parsed.data;

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
