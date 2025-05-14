import "server-only";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { urls, users } from "@/server/db/schema";
import { FLAGGED_NO_THREAT_URL_AUTO_LIMIT } from "@/site-config/limits";
import { Url } from "@/types/server/types";

const FLAGGED_NO_THREAT_LIMIT = FLAGGED_NO_THREAT_URL_AUTO_LIMIT;

type AccessCheckResult =
  | { allowed: true; url: Url }
  | {
      allowed: false;
      reason: "not_found" | "suspended" | "inactive" | "flagged_limit_reached";
    };

/**
 * Checks for url safety against url status, creator status, availability and auto bans flagged/threat urls on crossing pre-defined hard limits.
 *
 * @param shortCode Short code of the shrinkifiy URL
 * @returns
 */
export async function checkUrlAccess(
  shortCode: string
): Promise<AccessCheckResult> {
  const [url] = await db
    .select()
    .from(urls)
    .where(eq(urls.shortCode, shortCode))
    .limit(1);

  if (!url) return { allowed: false, reason: "not_found" };

  // Check URL-specific block statuses first
  if (url.status === "suspended")
    return { allowed: false, reason: "suspended" };

  if (url.status === "inactive") return { allowed: false, reason: "inactive" };

  // URL must have a creator
  if (!url.userId) return { allowed: false, reason: "not_found" };

  // Fetch the creator
  const [creator] = await db
    .select({ status: users.status })
    .from(users)
    .where(eq(users.id, url.userId));

  if (!creator) return { allowed: false, reason: "not_found" };

  if (creator.status === "suspended")
    return { allowed: false, reason: "suspended" };

  if (creator.status === "inactive")
    return { allowed: false, reason: "inactive" };

  // Check flagged threshold
  if (url.flagged && !url.threat && url.clicks >= FLAGGED_NO_THREAT_LIMIT) {
    await db
      .update(urls)
      .set({ status: "suspended" })
      .where(eq(urls.id, url.id));

    return { allowed: false, reason: "flagged_limit_reached" };
  }

  return { allowed: true, url };
}
