import { SEED_LIMITS } from "@/site-config/limits";
import { z } from "zod";

export const seedOptionsTimeRangeSchema = z.enum([
  "24H",
  "7D",
  "30D",
  "3M",
  "6M",
  "1Y",
]);

const { MAX_USERS, MAX_URLS_PER_USER, MAX_CLICKS_PER_URL } = SEED_LIMITS;

export const seedOptionsSchema = z.object({
  userCount: z.coerce
    .number()
    .int()
    .min(1, "At least 1 user required")
    .max(MAX_USERS, `Max ${SEED_LIMITS.MAX_USERS} users allowed`),
  maxUrlsPerUser: z.coerce
    .number()
    .int()
    .min(0)
    .max(MAX_URLS_PER_USER, `Max ${MAX_URLS_PER_USER} URLs per user`),
  maxClicksPerUrl: z.coerce
    .number()
    .int()
    .min(0)
    .max(MAX_CLICKS_PER_URL, `Max ${MAX_CLICKS_PER_URL} clicks per URL`),
  period: seedOptionsTimeRangeSchema,
  flaggedUrlRate: z.coerce
    .number()
    .min(0, "Flag rate cannot be less than 0")
    .max(1, "Flag rate cannot be more than 1")
    .optional(),
});

export type SeedOptions = z.infer<typeof seedOptionsSchema>;
export type SeedOptionsTimeRange = z.infer<typeof seedOptionsTimeRangeSchema>;
