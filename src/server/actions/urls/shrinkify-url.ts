"use server";

import { ApiResponse } from "@/lib/types";
import { ensureHttps, isValidUrl } from "@/lib/utils";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "@/server/db";
import { urls } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/server/auth";
import { checkUrlSafety } from "./check-url-safety";

const shrinkifyUrlSchema = z.object({
  url: z.string().refine(isValidUrl, {
    message: "Please enter a valid URL",
  }),
  customCode: z
    .string()
    .max(20, "Custom code must be less than 255 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Custom code must be alphanumeric or hyphen")
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
});

export async function shrinkifyUrl(formData: FormData): Promise<
  ApiResponse<{
    shortUrl: string;
    flagged: boolean;
    flagReason?: string | null;
    message?: string;
  }>
> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const url = formData.get("url") as string;
    const customCode = formData.get("customCode") as string;

    const validatedFields = shrinkifyUrlSchema.safeParse({
      url,
      customCode: customCode ? customCode : undefined,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error:
          validatedFields.error.flatten().fieldErrors.url?.[0] ||
          validatedFields.error.flatten().fieldErrors.customCode?.[0] ||
          "Invalid URL",
      };
    }

    const originalUrl = ensureHttps(validatedFields.data.url);

    const safetyCheck = await checkUrlSafety(originalUrl);

    let flagged = false;
    let flagReason = null;

    if (safetyCheck.success && safetyCheck.data) {
      flagged = safetyCheck.data.flagged;
      flagReason = safetyCheck.data.reason;

      if (
        safetyCheck.data.category === "malicious" &&
        safetyCheck.data.confidence > 0.7 &&
        session?.user?.role !== "admin"
      ) {
        return {
          success: false,
          error: "This URL is flagged as malicious",
        };
      }
    }

    let shortCode = validatedFields.data.customCode || nanoid(6);

    if (validatedFields.data.customCode) {
      // Check if the custom code already exists
      const existingCustomCode = await db.query.urls.findFirst({
        where: (urls, { eq }) => eq(urls.shortCode, shortCode),
      });

      if (existingCustomCode) {
        return {
          success: false,
          error: "Custom code already exists",
        };
      }
    } else {
      // Allow only 3 retries
      let attempts = 0;
      let uniqueCodeFound = false;

      while (attempts < 3) {
        const existingUrl = await db.query.urls.findFirst({
          where: (urls, { eq }) => eq(urls.shortCode, shortCode),
        });

        if (!existingUrl) {
          uniqueCodeFound = true;
          break;
        }

        shortCode = nanoid(6);
        attempts++;
      }

      if (!uniqueCodeFound) {
        return {
          success: false,
          error: "Failed to generate a unique short code. Please try again.",
        };
      }
    }

    await db.insert(urls).values({
      originalUrl,
      shortCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId || null,
      flagged,
      flagReason,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/r/${shortCode}`;

    console.log({ server: shortUrl, baseUrl });

    revalidatePath("/");

    return {
      success: true,
      data: {
        shortUrl,
        flagged,
        flagReason,
        message: flagged
          ? "This URL has been flagged for review by our safety system. It may be temporarily limited until approved by an administrator."
          : undefined,
      },
    };
  } catch (error) {
    console.error("Failed to shrinkify URL", error);
    return {
      success: false,
      error: "Failed to shrinkify URL",
    };
  }
}
