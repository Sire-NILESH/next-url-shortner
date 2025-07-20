import "server-only";

import { redis } from "@/server/redis/redis";
import { UrlAccessCheckResult } from "@/types/server/types";
import { createRedisCache } from "../../cache-factory";
import { getUserUrlShortCodesByUserId } from "@/server/services/url/get-user-url-shortcodes-by-userid";

const REDIRECT_URL_PREFIX = "userRedirectUrl";
// const USER_SHORTCODES_PREFIX = "userShortCodes";
const TTL_SECONDS = 86400;

const redirectUrlCacheBase = createRedisCache<{
  cacheUrl: UrlAccessCheckResult;
}>({
  prefix: REDIRECT_URL_PREFIX,
  ttlInSeconds: TTL_SECONDS,
  allowCompression: true,
});

export async function deleteAllCacheUrlShortCodesByUserId(
  userId: string
): Promise<void> {
  const userUrlShortCodes = await getUserUrlShortCodesByUserId(userId);

  if (!userUrlShortCodes.success)
    throw new Error("Error getting user URLs shortcode");

  const keys = userUrlShortCodes.data.map(
    ({ shortCode }) => `${REDIRECT_URL_PREFIX}:${shortCode}`
  );

  await redis.del(...keys);
}

export const redirectUrlCache = {
  ...redirectUrlCacheBase,
  deleteAllCacheUrlShortCodesByUserId,
};
