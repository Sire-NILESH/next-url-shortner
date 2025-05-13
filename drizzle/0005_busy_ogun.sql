CREATE TYPE "public"."flag_category" AS ENUM('safe', 'suspicious', 'malicious', 'inappropriate', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."threat_type" AS ENUM('MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION', 'THREAT_TYPE_UNSPECIFIED');--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "threat" "threat_type";--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "flag_category" "flag_category";