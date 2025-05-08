CREATE INDEX "idx_click_url_id" ON "click_events" USING btree ("url_id");--> statement-breakpoint
CREATE INDEX "idx_click_user_id" ON "click_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_urls_user_id" ON "urls" USING btree ("user_id");