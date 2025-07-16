import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
import { headers } from "next/headers";

// 1. Define all use cases (keys) here
const limiterConfigs = {
  urlShortenRateLimit: Ratelimit.fixedWindow(5, "1 m"),
  clickTrackRateLimit: Ratelimit.fixedWindow(100, "1 m"),
  authRateLimit: Ratelimit.fixedWindow(5, "2 m"),
  userUrlModificatonsRateLimit: Ratelimit.fixedWindow(10, "1 m"),
  generalRateLimit: Ratelimit.fixedWindow(10, "60 s"),
} as const;

// 2. Type-safe limiter names
type LimiterKeyType = keyof typeof limiterConfigs;

// 3. Build all Ratelimit instances just once when module is loaded
const limiterInstances: Record<LimiterKeyType, Ratelimit> = Object.fromEntries(
  Object.entries(limiterConfigs).map(([key, limiter]) => [
    key,
    new Ratelimit({ redis, limiter }),
  ])
) as Record<LimiterKeyType, Ratelimit>;

type RateLimitResponseType = ReturnType<Ratelimit["limit"]>;

// 4. Generic rate limit function
export const applyRateLimit = async ({
  limiterKey,
}: {
  limiterKey: LimiterKeyType;
}): RateLimitResponseType => {
  if (process.env.NODE_ENV === "development") {
    // Type-safe mock response
    return {
      success: true,
      limit: 9999,
      remaining: 9998,
      pending: Promise.resolve(),
      reset: new Date(Date.now() + 60000).getTime(), // match actual `Date` type
    };
  }

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const ratelimit = limiterInstances[limiterKey];

  return ratelimit.limit(`${limiterKey}-${ip}`);
};
