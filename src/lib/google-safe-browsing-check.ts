import "server-only";

import { ThreatTypeEnum } from "@/types/server/types";
import "server-only";

const SAFE_BROWSING_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY!;

// Google Safe Browsing Response Types
export type ThreatMatch = {
  threatType: ThreatTypeEnum;
  platformType: string;
  threatEntryType: "URL";
  threat: { url: string };
  cacheDuration: string;
};

type SafeBrowsingResponse = { matches: ThreatMatch[] } | Record<string, never>;

export async function checkWithGoogleSafeBrowsing(
  url: string
): Promise<ThreatMatch | null> {
  if (!SAFE_BROWSING_API_KEY) {
    return null;
  }

  const res = await fetch(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 12 },
      body: JSON.stringify({
        client: {
          clientId: "shrinkify",
          clientVersion: "1.0.0",
        },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
    }
  );

  if (!res.ok) throw new Error("Safe Browsing API failed");

  const data: SafeBrowsingResponse = await res.json();

  return "matches" in data &&
    Array.isArray(data.matches) &&
    data.matches.length > 0
    ? data.matches[0]
    : null;
}
