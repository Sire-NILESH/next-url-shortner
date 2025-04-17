import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

// Define user roles enum
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// Url threat types from Google Safe Browsing API
export const threatTypeEnum = pgEnum("threat_type", [
  "MALWARE",
  "SOCIAL_ENGINEERING",
  "UNWANTED_SOFTWARE",
  "POTENTIALLY_HARMFUL_APPLICATION",
  "THREAT_TYPE_UNSPECIFIED",
]);

export const flagCategoryEnum = pgEnum("flag_category", [
  "safe",
  "suspicious",
  "malicious",
  "inappropriate",
  "unknown",
]);

export const urlStatusEnum = pgEnum("status", [
  "active",
  "suspended",
  "inactive",
]);

export const userStatusEnum = pgEnum("status", [
  "active",
  "suspended",
  "inactive",
]);

// Define user table
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRoleEnum("role").default("user").notNull(),
  status: userStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 })
    .notNull()
    .primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  originalUrl: varchar("original_url", { length: 2000 }).notNull(),
  shortCode: varchar("short_code", { length: 30 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  clicks: integer("clicks").default(0).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id, {
    onDelete: "set null",
  }),
  flagged: boolean("flagged").default(false).notNull(), //from Google Safe Browsing API
  threat: threatTypeEnum("threat"), //from Google Safe Browsing API
  flagCategory: flagCategoryEnum("flag_category"), //from AI
  flagReason: text("flag_reason"), //from AI
  status: urlStatusEnum("status").notNull().default("active"),
});

export const clickEvents = pgTable("click_events", {
  id: serial("id").primaryKey(),
  urlId: integer("url_id")
    .notNull()
    .references(() => urls.id, { onDelete: "cascade" }),
  clickedAt: timestamp("clicked_at").defaultNow(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id, {
    onDelete: "set null",
  }),
  browser: varchar("browser", { length: 100 }),
  platform: varchar("platform", { length: 100 }),
});

export const clickEventsRelations = relations(clickEvents, ({ one }) => ({
  url: one(urls, {
    fields: [clickEvents.urlId],
    references: [urls.id],
  }),
  user: one(users, {
    fields: [clickEvents.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  urls: many(urls),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const urlsRelations = relations(urls, ({ one }) => ({
  user: one(users, {
    fields: [urls.userId],
    references: [users.id],
  }),
}));
