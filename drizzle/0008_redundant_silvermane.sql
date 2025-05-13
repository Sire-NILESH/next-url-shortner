CREATE TYPE "public"."url_status" AS ENUM('active', 'suspended', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'inactive');--> statement-breakpoint
ALTER TABLE "urls" ALTER COLUMN "status" SET DATA TYPE url_status;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE user_status;--> statement-breakpoint
DROP TYPE "public"."status";