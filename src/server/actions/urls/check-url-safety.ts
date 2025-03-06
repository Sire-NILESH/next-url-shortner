"use server";

import { ApiResponse } from "@/lib/types";

export type UrlSafetyCheck = {
  isSafe: boolean;
  flagged: boolean;
  reason: string | null;
  category: "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown";
  confidence: number;
};

export async function checkUrlSafety(
  url: string
): Promise<ApiResponse<UrlSafetyCheck>> {
  try {
    // validate URL Format
    try {
      new URL(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        success: false,
        error: "Invalid URL format",
      };
    }

    // TODO: do an actual validation here
    const chance = await Promise.resolve(Math.floor(Math.random()));

    if (chance > 0.2) {
      return {
        success: true,
        data: {
          isSafe: true,
          flagged: false,
          reason: null,
          category: "safe",
          confidence: 1,
        },
      };
    } else {
      return {
        success: true,
        data: {
          isSafe: false,
          flagged: true,
          reason: "This url was flagged by 4 web security vendors",
          category: "suspicious",
          confidence: 1,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to check URL safety",
    };
  }
}
