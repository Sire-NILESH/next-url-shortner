"use server";

import { ensureHttps, isValidUrl } from "@/lib/utils";
import { db } from "@/server/db";
import { urls } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { ensureValidUserStatus } from "@/server/services/user/ensure-valid-user-status";
import {
  ApiResponse,
  FlagCategoryTypeEnum,
  ThreatTypeEnum,
} from "@/types/server/types";
import { nanoid } from "nanoid";
import { z } from "zod";
import { checkUrlSafety } from "../../services/url/check-url-safety.service";

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

export async function createShrinkifyUrl(formData: FormData): Promise<
  ApiResponse<{
    shortUrl: string;
    threat: ThreatTypeEnum;
    flagged: boolean;
    flagReason?: string | null;
    message?: string;
  }>
> {
  try {
    const authResponse = await authorizeRequest();

    if (!authResponse.success) return authResponse;

    const { data: session } = authResponse;
    const userId = session.user.id;

    const validUserStatusResponse = await ensureValidUserStatus(userId);

    if (!validUserStatusResponse.success) return validUserStatusResponse;

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
    let flagReason: string | null = null;
    let threatType: ThreatTypeEnum = null;
    let flagCategory: FlagCategoryTypeEnum = null;

    if (safetyCheck.success && safetyCheck.data) {
      const ai = safetyCheck.data;

      flagged = ai.flagged;
      flagReason = ai.reason;
      flagCategory = ai.category;

      // Set to malicious only if confidence is high
      if (
        ai.category === "malicious" &&
        ai.confidence > 0.7 &&
        session?.user?.role !== "admin"
      ) {
        return {
          success: false,
          error: "This URL is flagged as malicious and cannot be shortened.",
        };
      }
    }

    // Get threat type from Safe Browsing
    threatType = safetyCheck.success
      ? (safetyCheck.data?.threat as ThreatTypeEnum) ?? null
      : null;

    let shortCode = validatedFields.data.customCode || nanoid(6);

    if (validatedFields.data.customCode) {
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
      // Retry up to 3 times
      let attempts = 0;
      while (attempts < 3) {
        const exists = await db.query.urls.findFirst({
          where: (urls, { eq }) => eq(urls.shortCode, shortCode),
        });
        if (!exists) break;
        shortCode = nanoid(6);
        attempts++;
      }

      if (attempts >= 3) {
        return {
          success: false,
          error: "Failed to generate unique short code. Please try again.",
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
      threat: threatType,
      flagCategory,
      flagReason,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/r/${shortCode}`;

    // revalidatePath("/");

    return {
      success: true,
      data: {
        shortUrl,
        threat: threatType,
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
