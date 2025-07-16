import { UserUrl } from "@/types/client/types";
import { createRedisCache } from "../../cache-factory";

export const userUrlsCache = createRedisCache<{
  userId: string;
  urls: UserUrl[];
}>({
  prefix: "userUrls",
  ttlInSeconds: 60,
  allowCompression: true,
});
