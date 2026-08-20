import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: serial().primaryKey(),
  slug: text().notNull().unique(),
  teamName: text("team_name").notNull(),
  managerName: text("manager_name").notNull(),
  logoUrl: text("logo_url"),
  motto: text(),
  teamBio: text("team_bio").notNull().default(""),
  managerBio: text("manager_bio").notNull().default(""),
  founded: integer(),
  sleeperRosterId: integer("sleeper_roster_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const powerRankings = pgTable("power_rankings", {
  id: serial().primaryKey(),
  season: integer().notNull(),
  week: integer().notNull(),
  teamId: integer("team_id").notNull().references(() => teams.id),
  rank: integer().notNull(),
  blurb: text().notNull().default(""),
  trend: text().notNull().default("same"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matchups = pgTable("matchups", {
  id: serial().primaryKey(),
  season: integer().notNull(),
  week: integer().notNull(),
  teamAId: integer("team_a_id").notNull().references(() => teams.id),
  teamBId: integer("team_b_id").notNull().references(() => teams.id),
  teamAScore: doublePrecision("team_a_score"),
  teamBScore: doublePrecision("team_b_score"),
  isComplete: boolean("is_complete").notNull().default(false),
  manualOverride: boolean("manual_override").notNull().default(false),
  sleeperSyncedAt: timestamp("sleeper_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leagueSyncSettings = pgTable("league_sync_settings", {
  id: serial().primaryKey(),
  sleeperLeagueId: text("sleeper_league_id"),
  season: integer().notNull(),
  lastSyncedAt: timestamp("last_synced_at"),
  lastSyncStatus: text("last_sync_status"),
  lastSyncMessage: text("last_sync_message").notNull().default(""),
});

export const weeklyPreviews = pgTable("weekly_previews", {
  id: serial().primaryKey(),
  season: integer().notNull(),
  week: integer().notNull(),
  title: text().notNull(),
  content: text().notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const podcastEpisodes = pgTable("podcast_episodes", {
  id: serial().primaryKey(),
  title: text().notNull(),
  description: text().notNull().default(""),
  driveUrl: text("drive_url").notNull(),
  episodeNumber: integer("episode_number"),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const trades = pgTable("trades", {
  id: serial().primaryKey(),
  tradeDate: text("trade_date").notNull(),
  season: integer(),
  summary: text().notNull(),
  details: text().notNull().default(""),
  teamIds: jsonb("team_ids").notNull().$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const champions = pgTable("champions", {
  id: serial().primaryKey(),
  season: integer().notNull().unique(),
  teamId: integer("team_id").notNull().references(() => teams.id),
  record: text(),
  note: text().notNull().default(""),
});

export const awards = pgTable("awards", {
  id: serial().primaryKey(),
  season: integer().notNull(),
  title: text().notNull(),
  teamId: integer("team_id").references(() => teams.id),
  description: text().notNull().default(""),
});

export const teamHistoryEntries = pgTable("team_history_entries", {
  id: serial().primaryKey(),
  teamId: integer("team_id").notNull().references(() => teams.id),
  season: integer().notNull(),
  wins: integer().notNull().default(0),
  losses: integer().notNull().default(0),
  ties: integer().notNull().default(0),
  finish: text(),
  note: text().notNull().default(""),
});
