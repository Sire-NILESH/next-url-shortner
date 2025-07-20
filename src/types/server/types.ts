import {
  clickEvents,
  flagCategoryEnum,
  threatTypeEnum,
  urls,
  urlStatusEnum,
  userRoleEnum,
  users,
  userStatusEnum,
} from "@/server/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error?: string;
      redirect?: string;
    };

// Full user type including password and any sensitive fields
export type UserWithSensitive = InferSelectModel<typeof users>;

// Public-safe user type with sensitive fields omitted
export type User = Omit<UserWithSensitive, "password">;

export type Url = InferSelectModel<typeof urls>;

export type ClickEvent = InferSelectModel<typeof clickEvents>;

export type ThreatTypeEnum = (typeof threatTypeEnum.enumValues)[number] | null;

export type FlagCategoryTypeEnum =
  | (typeof flagCategoryEnum.enumValues)[number]
  | null;

export type UserStatusTypeEnum = (typeof userStatusEnum.enumValues)[number];

export type UserRoleTypeEnum = (typeof userRoleEnum.enumValues)[number];

export type UserProviderTypeEnum = "google" | "credentials";

export type UrlStatusTypeEnum = (typeof urlStatusEnum.enumValues)[number];

export type WarnRedirectSearchParams = {
  redirect?: string;
  flagged?: string;
  reason?: string;
  threat?: string;
};

export type UserUrlShortCode = { urlId: number; shortCode: string };

export type CacheUrl = Pick<
  Url,
  | "id"
  | "shortCode"
  | "originalUrl"
  | "userId"
  | "status"
  | "flagged"
  | "threat"
  | "flagCategory"
  | "flagReason"
> & {
  userStatus: UserStatusTypeEnum;
};

export type UrlAccessCheckResult =
  | { allowed: true; url: CacheUrl }
  | {
      allowed: false;
      reason: "not_found" | "suspended" | "inactive" | "flagged_limit_reached";
    };
