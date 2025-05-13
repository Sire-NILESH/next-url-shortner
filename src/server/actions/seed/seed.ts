"use server";

import generateId from "@/lib/auth/utils/generate-id";
import { hashPassword } from "@/lib/auth/utils/password-helpers";
import {
  SeedOptions,
  seedOptionsSchema,
} from "@/lib/validations/SeedOptionsSchema";
import { db } from "@/server/db";
import { clickEvents, threatTypeEnum, urls, users } from "@/server/db/schema";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { faker } from "@faker-js/faker";
import { ApiResponse } from "../fake-fetcher";
import { FLAGGED_NO_THREAT_URL_AUTO_LIMIT } from "@/site-config/limits";

export type SeedTimeRange = "24H" | "7D" | "30D" | "3M" | "6M" | "1Y";

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

type SeedActionReturnType = Promise<
  ApiResponse<{ users: number; urls: number; clicks: number }>
>;

export async function seedDatabase(options: SeedOptions): SeedActionReturnType {
  try {
    if (process.env.NODE_ENV !== "development") {
      return {
        success: false,
        error: "You are not allowed to perform this action yet.",
      };
    }

    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success) return authResponse;

    const parsedOptions = seedOptionsSchema.safeParse(options);

    if (!parsedOptions.success) {
      return { success: false, error: "Invalid seed option parameters" };
    }

    const {
      userCount,
      maxUrlsPerUser,
      maxClicksPerUrl,
      period,
      flaggedUrlRate = 0,
    } = parsedOptions.data;

    console.log("Begin - Seeding DB 💿 in 3 steps with:", parsedOptions.data, {
      user: authResponse.data.user,
    });

    const now = new Date();
    const startDate = getStartDateFromPeriod(period);

    const threatTypes = threatTypeEnum.enumValues;

    const seedResult = await db.transaction(async (tx) => {
      // INSERTING USERS
      const userRecords: (typeof users.$inferInsert)[] = [];
      const hashedPassword = await hashPassword("seed-test-user-12345");

      for (let i = 0; i < userCount; i++) {
        const createdAt = randomDateBetween(startDate, now);
        userRecords.push({
          id: `seed_user_${generateId()}`,
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password: hashedPassword,
          image: faker.image.avatar(),
          createdAt,
          updatedAt: createdAt,
          role: "user",
          status: "active",
        });
      }

      const insertedUsers = await tx
        .insert(users)
        .values(userRecords)
        .returning();

      console.log("1 - USER seeding completed ✔️");

      // INSERTING URLS
      const allUrls: (typeof urls.$inferInsert)[] = [];

      for (const user of insertedUsers) {
        const urlsCount = faker.number.int({ min: 0, max: maxUrlsPerUser });

        for (let j = 0; j < urlsCount; j++) {
          const createdAt = randomDateBetween(user.createdAt, now);

          const shouldFlag = Math.random() < flaggedUrlRate;
          const hasThreat = shouldFlag && Math.random() < 0.5;
          const threat = hasThreat
            ? faker.helpers.arrayElement(threatTypes)
            : null;
          const hasCaution = shouldFlag && !hasThreat;

          const clicks = faker.number.int({
            min: 0,
            max: hasThreat
              ? 0
              : hasCaution
              ? FLAGGED_NO_THREAT_URL_AUTO_LIMIT
              : maxClicksPerUrl,
          });

          const isAutoSuspended =
            hasCaution && clicks >= FLAGGED_NO_THREAT_URL_AUTO_LIMIT;

          allUrls.push({
            originalUrl: faker.internet.url(),
            shortCode: `s${faker.string.alphanumeric(6)}`,
            name: faker.lorem.words(3),
            createdAt,
            updatedAt: createdAt,
            clicks,
            userId: user.id,
            flagged: shouldFlag,
            threat,
            flagCategory: shouldFlag ? "suspicious" : null,
            flagReason: shouldFlag
              ? faker.lorem.sentence().slice(0, 200)
              : null,
            status: hasThreat || isAutoSuspended ? "suspended" : "active",
          });
        }
      }

      const insertedUrls = await tx.insert(urls).values(allUrls).returning();

      console.log("2 - URL seeding completed ✔️");

      // INSERTING CLICKS
      const allClickEvents: (typeof clickEvents.$inferInsert)[] = [];

      for (const url of insertedUrls) {
        for (let k = 0; k < url.clicks; k++) {
          const randomUser = faker.helpers.arrayElement(insertedUsers);
          allClickEvents.push({
            urlId: url.id,
            clickedAt: randomDateBetween(url.createdAt, now),
            userId: randomUser.id,
            browser: faker.helpers.arrayElement([
              "Chrome",
              "Firefox",
              "Safari",
              "Edge",
              "Opera",
              "Brave",
              "Vivaldi",
              "Internet Explorer",
              "Samsung Internet",
            ]),
            platform: faker.helpers.arrayElement([
              "Windows",
              "macOS",
              "Linux",
              "Android",
              "iOS",
            ]),
          });
        }
      }

      const insertedClickEvents = await tx
        .insert(clickEvents)
        .values(allClickEvents)
        .returning();

      return {
        users: insertedUsers.length,
        urls: insertedUrls.length,
        clicks: insertedClickEvents.length,
      };
    });

    console.log("3 - CLICK seeding completed ✔️");
    console.log("Final - Database seeding complete ✅");

    return {
      success: true,
      data: seedResult,
    };
  } catch (error) {
    console.error("Error while seeding data", error);
    return { success: false, error: "Error while seeding data" };
  }
}

function getStartDateFromPeriod(period: SeedTimeRange): Date {
  const now = new Date();
  switch (period) {
    case "24H":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "7D":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30D":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "3M":
      return new Date(new Date().setMonth(now.getMonth() - 3));
    case "6M":
      return new Date(new Date().setMonth(now.getMonth() - 6));
    case "1Y":
      return new Date(new Date().setFullYear(now.getFullYear() - 1));
  }
}
