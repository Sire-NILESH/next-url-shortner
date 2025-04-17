import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { UrlSafetyCheck } from "@/server/actions/urls/check-url-safety";
import { ThreatMatch } from "./google-safe-browsing-check";
import { flagCategoryEnum } from "@/server/db/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function analyzeWithGemini(
  url: string,
  threatCheck: ThreatMatch | null
): Promise<UrlSafetyCheck> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const threatInfo = threatCheck
    ? `\n\n⚠️ Google Safe Browsing flagged this URL for: ${threatCheck.threatType}. Be conservative in your judgment if threats are flagged.`
    : "Google safe browsing api gave this as a response for threat match null.";

  const prompt = `
    Analyze this URL for safety concerns: "${url}"
    ${threatInfo}
    
    Consider the following aspects:
    1. Is it a known phishing site?
    2. Does it contain malware or suspicious redirects?
    3. Is it associated with scams or fraud?
    4. Does it contain inappropriate content (adult, violence, etc.)?
    5. Is the domain suspicious or newly registered?
    6. Do not leak any info like usage of google safe browsing api etc in the reason field of your response.

    Respond in JSON format with the following structure:
    {
      "isSafe": boolean,
      "flagged": boolean,
      "reason": string or null,
      "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
      "confidence": number between 0 and 1
    }

    Only respond with the JSON object, no additional text.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse Gemini JSON response");

  const geminiResponse: UrlSafetyCheck = JSON.parse(jsonMatch[0]);

  // Gemini could return confidence: 999 or negative values due to hallucination.
  geminiResponse.confidence = Math.max(
    0,
    Math.min(1, geminiResponse.confidence)
  );

  // Re enforce valid categories
  const validCategories = flagCategoryEnum.enumValues;
  if (
    geminiResponse.category &&
    !validCategories.includes(geminiResponse.category)
  ) {
    geminiResponse.category = "unknown";
  }

  const finalCombinedResponse = structuredClone(geminiResponse);

  finalCombinedResponse.threat = threatCheck ? threatCheck.threatType : null;
  finalCombinedResponse.flagged = !!threatCheck || geminiResponse.flagged;

  return finalCombinedResponse;
}
