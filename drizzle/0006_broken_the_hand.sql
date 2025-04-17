CREATE TYPE "public"."status" AS ENUM('active', 'suspended', 'inactive');--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "status" "status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "status" DEFAULT 'active' NOT NULL;