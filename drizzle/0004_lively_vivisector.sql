CREATE TABLE "click_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"url_id" integer NOT NULL,
	"clicked_at" timestamp DEFAULT now(),
	"user_id" varchar(255),
	"browser" varchar(100),
	"platform" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_url_id_urls_id_fk" FOREIGN KEY ("url_id") REFERENCES "public"."urls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "click_events" ADD CONSTRAINT "click_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;