import { redis } from "./redis";
import { deflate, inflate } from "pako";

export function compress(str: string): string {
  const compressed = deflate(str);
  return Buffer.from(compressed).toString("base64");
}

export function decompress(base64: string): string {
  const buffer = Buffer.from(base64, "base64");
  return inflate(buffer, { to: "string" });
}

type CacheOptions = {
  prefix: string;
  ttlInSeconds?: number;
  allowCompression?: boolean;
};

export function createRedisCache<T>({
  prefix,
  ttlInSeconds,
  allowCompression = true,
}: CacheOptions) {
  return {
    async get(key: string): Promise<T | null> {
      const fullKey = `${prefix}:${key}`;
      try {
        const raw = await redis.get<string>(fullKey);
        if (!raw) return null;

        const json = allowCompression ? decompress(raw) : raw;
        return JSON.parse(json) as T;
      } catch (err) {
        console.error(`Redis GET error for key "${fullKey}"`, err);
        return null;
      }
    },

    async set(key: string, value: T): Promise<void> {
      const fullKey = `${prefix}:${key}`;
      try {
        const json = JSON.stringify(value);
        const final = allowCompression ? compress(json) : json;

        if (ttlInSeconds) {
          await redis.set(fullKey, final, { ex: ttlInSeconds });
        } else {
          await redis.set(fullKey, final);
        }
      } catch (err) {
        console.error(`Redis SET error for key "${fullKey}"`, err);
      }
    },

    async delete(key: string): Promise<void> {
      const fullKey = `${prefix}:${key}`;
      try {
        await redis.del(fullKey);
      } catch (err) {
        console.error(`Redis DELETE error for key "${fullKey}"`, err);
      }
    },

    getFullKey(key: string): string {
      return `${prefix}:${key}`;
    },
  };
}
