"use server";

import { ensureHttps, isValidUrl } from "@/lib/utils";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { urls, users } from "@/server/db/schema";
import { auth } from "@/server/auth";
import { checkUrlSafety } from "./check-url-safety";
import {
  ApiResponse,
  FlagCategoryTypeEnum,
  ThreatTypeEnum,
} from "@/types/server/types";

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
    threat: ThreatTypeEnum;
    flagged: boolean;
    flagReason?: string | null;
    message?: string;
  }>
> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "You need to be logged in" };
    }

    // Fetch fresh user data and check user status
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.status === "suspended") {
      return {
        success: false,
        error: "Your account is suspended and cannot create shrinkify URLs.",
      };
    }

    if (user.status === "inactive") {
      return {
        success: false,
        redirect: "/inactive-user",
      };
    }

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
