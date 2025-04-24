"use server";

import { getShrinkifyUrl } from "@/lib/utils";
import { updateShrinkifyUrlSchema } from "@/lib/validations/URLSchema";
import { db, eq } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ApiResponse } from "@/types/server/types";

export async function updateUrl(
  formData: FormData
): Promise<ApiResponse<{ shortUrl: string }>> {
  try {
    const authResponse = await authorizeRequest();

    if (!authResponse.success) return authResponse;

    const { data: session } = authResponse;
    const userId = session?.user?.id;

    const validatedFields = updateShrinkifyUrlSchema.safeParse({
      id: formData.get("id"),
      customCode: formData.get("customCode"),
      name: formData.get("name"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error:
          validatedFields.error.flatten().fieldErrors.id?.[0] ||
          validatedFields.error.flatten().fieldErrors.customCode?.[0] ||
          "Invalid URL ID",
      };
    }

    const { id, customCode } = validatedFields.data;

    const existingUrl = await db.query.urls.findFirst({
      where: (urls, { eq, and }) =>
        and(eq(urls.id, id), eq(urls.userId, userId)),
    });

    if (!existingUrl) {
      return {
        success: false,
        error: "URL not found or you don't have permission to update it",
      };
    }

    const codeExists = await db.query.urls.findFirst({
      where: (urls, { eq, and, ne }) =>
        and(eq(urls.shortCode, customCode), ne(urls.id, id)),
    });

    if (codeExists) {
      return {
        success: false,
        error: "Custom code already exists",
      };
    }

    await db
      .update(urls)
      .set({
        shortCode: customCode,
        name: validatedFields.data.name || null,
        updatedAt: new Date(),
      })
      .where(eq(urls.id, id));

    const shortUrl = getShrinkifyUrl(customCode);

    return {
      success: true,
      data: { shortUrl },
    };
  } catch (error) {
    console.error("Failed to update URL", error);
    return {
      success: false,
      error: "An error occurred",
    };
  }
}
