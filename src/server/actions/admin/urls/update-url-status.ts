"use server";

import { db, eq } from "@/server/db";
import { urls, urlStatusEnum } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateUrlStatusSchema = z.object({
  urlId: z.number().int().positive(),
  status: z.enum(urlStatusEnum.enumValues),
});

export type UpdateUrlStatusInput = z.infer<typeof updateUrlStatusSchema>;

export async function updateUrlStatus(
  params: UpdateUrlStatusInput
): Promise<ApiResponse<null>> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsed = updateUrlStatusSchema.safeParse(params);

    if (!parsed.success) {
      return { success: false, error: "Invalid params" };
    }

    const { urlId, status } = parsed.data;

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
