import "server-only";

import { checkWithGoogleSafeBrowsing } from "@/server/services/url/google-safe-browsing-check.service";
import {
  ApiResponse,
  FlagCategoryTypeEnum,
  ThreatTypeEnum,
} from "@/types/server/types";
import { analyzeWithGemini } from "@/server/services/url/gemini-check.service";

export type UrlSafetyCheck = {
  isSafe: boolean;
  flagged: boolean;
  reason: string | null;
  category: FlagCategoryTypeEnum;
  threat: ThreatTypeEnum;
  confidence: number;
};

export async function checkUrlSafety(
  url: string
): Promise<ApiResponse<UrlSafetyCheck>> {
  try {
    new URL(url);
  } catch {
    return { success: false, error: "Invalid URL format" };
  }

  try {
    const threatCheck = await checkWithGoogleSafeBrowsing(url);

    if (process.env.GOOGLE_GEMINI_API_KEY) {
      const withGeminiResponse = await analyzeWithGemini(url, threatCheck);

      return {
        success: true,
        data: withGeminiResponse,
      };
    }

    if (threatCheck) {
      return {
        success: true,
        data: {
          isSafe: false,
          flagged: true,
          reason: null,
          category: null,
          threat: threatCheck.threatType,
          confidence: 1,
        } satisfies UrlSafetyCheck,
      };
    }

    return {
      success: true,
      data: {
        isSafe: true,
        flagged: false,
        reason: null,
        category: "safe",
        threat: null,
        confidence: 1,
      } satisfies UrlSafetyCheck,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to check URL safety",
    };
  }
}
