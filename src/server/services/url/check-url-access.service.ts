import { db } from "@/server/db";
import { urls, users } from "@/server/db/schema";
import { redirectUrlCache } from "@/server/redis/cache/urls/redirect-url-cache";
import { UrlAccessCheckResult } from "@/types/server/types";
import { eq } from "drizzle-orm";

/**
 * Checks for url safety against url status, creator status, availability and auto bans flagged/threat urls on crossing pre-defined hard limits.
 *
 * @param shortCode Short code of the shrinkifiy URL
 * @returns
 */
export async function checkUrlAccess(
  shortCode: string
): Promise<UrlAccessCheckResult> {
  // Try Redis first
  const cacheData = await redirectUrlCache.get(shortCode);
  if (cacheData) return cacheData.cacheUrl;

  const [result] = await db
    .select({
      url: urls,
      userStatus: users.status,
    })
    .from(urls)
    .leftJoin(users, eq(users.id, urls.userId))
    .where(eq(urls.shortCode, shortCode))
    .limit(1);

  let toCache: UrlAccessCheckResult;

  if (!result || !result.url) {
    toCache = { allowed: false, reason: "not_found" };
  } else {
    const { url, userStatus } = result;

    if (!url.userId || !userStatus) {
      toCache = { allowed: false, reason: "not_found" };
    } else if (url.status === "suspended" || userStatus === "suspended") {
      toCache = { allowed: false, reason: "suspended" };
    } else if (url.status === "inactive" || userStatus === "inactive") {
      toCache = { allowed: false, reason: "inactive" };
    } else {
      toCache = {
        allowed: true,
        url: {
          id: url.id,
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
          userId: url.userId,
          status: url.status,
          flagged: url.flagged,
          threat: url.threat,
          flagCategory: url.flagCategory,
          flagReason: url.flagReason,
          userStatus,
        },
      };
    }
  }

  await redirectUrlCache.set(shortCode, { cacheUrl: toCache });

  return toCache;
}
