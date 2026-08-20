CREATE TABLE "league_sync_settings" (
	"id" serial PRIMARY KEY,
	"sleeper_league_id" text,
	"season" integer NOT NULL,
	"last_synced_at" timestamp,
	"last_sync_status" text,
	"last_sync_message" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "matchups" ADD COLUMN "manual_override" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "matchups" ADD COLUMN "sleeper_synced_at" timestamp;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "sleeper_roster_id" integer;--> statement-breakpoint
ALTER TABLE "matchups" ALTER COLUMN "team_a_score" SET DATA TYPE double precision USING "team_a_score"::double precision;--> statement-breakpoint
ALTER TABLE "matchups" ALTER COLUMN "team_b_score" SET DATA TYPE double precision USING "team_b_score"::double precision;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_sleeper_roster_id_key" UNIQUE("sleeper_roster_id");