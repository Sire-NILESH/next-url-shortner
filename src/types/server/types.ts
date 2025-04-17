import {
  flagCategoryEnum,
  threatTypeEnum,
  urlStatusEnum,
  userRoleEnum,
  userStatusEnum,
} from "@/server/db/schema";

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

export type ThreatTypeEnum = (typeof threatTypeEnum.enumValues)[number] | null;

export type FlagCategoryTypeEnum =
  | (typeof flagCategoryEnum.enumValues)[number]
  | null;

export type UserStatusTypeEnum = (typeof userStatusEnum.enumValues)[number];

export type UserRoleTypeEnum = (typeof userRoleEnum.enumValues)[number];

export type UrlStatusTypeEnum = (typeof urlStatusEnum.enumValues)[number];
