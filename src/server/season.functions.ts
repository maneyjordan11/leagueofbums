import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, asc } from 'drizzle-orm'
import { db } from '../../db/index'
import { powerRankings, matchups, weeklyPreviews, teams } from '../../db/schema'
import { requireAdminMiddleware } from '../lib/auth'

// ---------- Power Rankings ----------

const PowerRankingSchema = z.object({
  season: z.number().int(),
  week: z.number().int(),
  teamId: z.number().int(),
  rank: z.number().int(),
  blurb: z.string().optional(),
  trend: z.enum(['up', 'down', 'same']).optional(),
})

export const getPowerRankings = createServerFn({ method: 'GET' })
  .inputValidator((data: { season: number }) => data)
  .handler(async ({ data }) => {
    return db
      .select({
        id: powerRankings.id,
        season: powerRankings.season,
        week: powerRankings.week,
        rank: powerRankings.rank,
        blurb: powerRankings.blurb,
        trend: powerRankings.trend,
        teamId: powerRankings.teamId,
        teamName: teams.teamName,
        managerName: teams.managerName,
        slug: teams.slug,
        logoUrl: teams.logoUrl,
      })
      .from(powerRankings)
      .innerJoin(teams, eq(powerRankings.teamId, teams.id))
      .where(eq(powerRankings.season, data.season))
      .orderBy(asc(powerRankings.week), asc(powerRankings.rank))
  })

export const createPowerRanking = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(PowerRankingSchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(powerRankings).values(data).returning()
    return row
  })

export const deletePowerRanking = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(powerRankings).where(eq(powerRankings.id, data.id))
    return { success: true }
  })

// ---------- Matchups ----------

const MatchupSchema = z.object({
  season: z.number().int(),
  week: z.number().int(),
  teamAId: z.number().int(),
  teamBId: z.number().int(),
  teamAScore: z.number().optional(),
  teamBScore: z.number().optional(),
  isComplete: z.boolean().optional(),
  manualOverride: z.boolean().optional(),
})

export const getMatchups = createServerFn({ method: 'GET' })
  .inputValidator((data: { season: number }) => data)
  .handler(async ({ data }) => {
    const rows = await db.select().from(matchups).where(eq(matchups.season, data.season))
    const allTeams = await db.select().from(teams)
    const teamMap = new Map(allTeams.map((t) => [t.id, t]))
    return rows
      .map((m) => ({
        ...m,
        teamA: teamMap.get(m.teamAId) ?? null,
        teamB: teamMap.get(m.teamBId) ?? null,
      }))
      .sort((a, b) => a.week - b.week)
  })

export const createMatchup = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(MatchupSchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(matchups).values(data).returning()
    return row
  })

export const updateMatchup = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(MatchupSchema.extend({ id: z.number() }))
  .handler(async ({ data }) => {
    const { id, ...values } = data
    const [row] = await db.update(matchups).set(values).where(eq(matchups.id, id)).returning()
    return row
  })

export const deleteMatchup = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(matchups).where(eq(matchups.id, data.id))
    return { success: true }
  })

// ---------- Weekly Previews ----------

const PreviewSchema = z.object({
  season: z.number().int(),
  week: z.number().int(),
  title: z.string().min(1),
  content: z.string().optional(),
})

export const getWeeklyPreviews = createServerFn({ method: 'GET' })
  .inputValidator((data: { season: number }) => data)
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(weeklyPreviews)
      .where(eq(weeklyPreviews.season, data.season))
    return rows.sort((a, b) => b.week - a.week)
  })

export const createWeeklyPreview = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(PreviewSchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(weeklyPreviews).values(data).returning()
    return row
  })

export const deleteWeeklyPreview = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(weeklyPreviews).where(eq(weeklyPreviews.id, data.id))
    return { success: true }
  })
