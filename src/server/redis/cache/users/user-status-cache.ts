import { UserStatusTypeEnum } from "@/types/server/types";
import { createRedisCache } from "../../cache-factory";

export const userStatusCache = createRedisCache<{
  userId: string;
  userStatus: UserStatusTypeEnum;
}>({
  prefix: "userStatus",
  ttlInSeconds: 86400, //24hr
  allowCompression: true,
});
