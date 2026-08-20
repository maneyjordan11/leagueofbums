CREATE TABLE "awards" (
	"id" serial PRIMARY KEY,
	"season" integer NOT NULL,
	"title" text NOT NULL,
	"team_id" integer,
	"description" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "champions" (
	"id" serial PRIMARY KEY,
	"season" integer NOT NULL UNIQUE,
	"team_id" integer NOT NULL,
	"record" text,
	"note" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matchups" (
	"id" serial PRIMARY KEY,
	"season" integer NOT NULL,
	"week" integer NOT NULL,
	"team_a_id" integer NOT NULL,
	"team_b_id" integer NOT NULL,
	"team_a_score" integer,
	"team_b_score" integer,
	"is_complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "podcast_episodes" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"drive_url" text NOT NULL,
	"episode_number" integer,
	"published_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "power_rankings" (
	"id" serial PRIMARY KEY,
	"season" integer NOT NULL,
	"week" integer NOT NULL,
	"team_id" integer NOT NULL,
	"rank" integer NOT NULL,
	"blurb" text DEFAULT '' NOT NULL,
	"trend" text DEFAULT 'same' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "team_history_entries" (
	"id" serial PRIMARY KEY,
	"team_id" integer NOT NULL,
	"season" integer NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"ties" integer DEFAULT 0 NOT NULL,
	"finish" text,
	"note" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"team_name" text NOT NULL,
	"manager_name" text NOT NULL,
	"logo_url" text,
	"motto" text,
	"team_bio" text DEFAULT '' NOT NULL,
	"manager_bio" text DEFAULT '' NOT NULL,
	"founded" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" serial PRIMARY KEY,
	"trade_date" text NOT NULL,
	"season" integer,
	"summary" text NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"team_ids" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weekly_previews" (
	"id" serial PRIMARY KEY,
	"season" integer NOT NULL,
	"week" integer NOT NULL,
	"title" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "awards" ADD CONSTRAINT "awards_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id");--> statement-breakpoint
ALTER TABLE "champions" ADD CONSTRAINT "champions_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id");--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_team_a_id_teams_id_fkey" FOREIGN KEY ("team_a_id") REFERENCES "teams"("id");--> statement-breakpoint
ALTER TABLE "matchups" ADD CONSTRAINT "matchups_team_b_id_teams_id_fkey" FOREIGN KEY ("team_b_id") REFERENCES "teams"("id");--> statement-breakpoint
ALTER TABLE "power_rankings" ADD CONSTRAINT "power_rankings_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id");--> statement-breakpoint
ALTER TABLE "team_history_entries" ADD CONSTRAINT "team_history_entries_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id");