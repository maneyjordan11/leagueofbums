import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '../../db/index'
import { trades, champions, teamHistoryEntries, teams } from '../../db/schema'
import { requireAdminMiddleware } from '../lib/auth'

// ---------- Trades ----------

const TradeSchema = z.object({
  tradeDate: z.string().min(1),
  season: z.number().int().optional(),
  summary: z.string().min(1),
  details: z.string().optional(),
  teamIds: z.array(z.number().int()).min(2),
})

export const getTrades = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db.select().from(trades).orderBy(desc(trades.id))
  const allTeams = await db.select().from(teams)
  const teamMap = new Map(allTeams.map((t) => [t.id, t]))
  return rows.map((t) => ({
    ...t,
    teams: t.teamIds.map((id) => teamMap.get(id)).filter(Boolean),
  }))
})

export const createTrade = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(TradeSchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(trades).values(data).returning()
    return row
  })

export const deleteTrade = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(trades).where(eq(trades.id, data.id))
    return { success: true }
  })

// ---------- Champions (past winners) ----------

const ChampionSchema = z.object({
  season: z.number().int(),
  teamId: z.number().int(),
  record: z.string().optional(),
  note: z.string().optional(),
})

export const getChampions = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db.select().from(champions).orderBy(desc(champions.season))
  const allTeams = await db.select().from(teams)
  const teamMap = new Map(allTeams.map((t) => [t.id, t]))
  return rows.map((c) => ({ ...c, team: teamMap.get(c.teamId) ?? null }))
})

export const createChampion = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(ChampionSchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(champions).values(data).returning()
    return row
  })

export const deleteChampion = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(champions).where(eq(champions.id, data.id))
    return { success: true }
  })

// ---------- Team season-by-season history ----------

const TeamHistorySchema = z.object({
  teamId: z.number().int(),
  season: z.number().int(),
  wins: z.number().int().optional(),
  losses: z.number().int().optional(),
  ties: z.number().int().optional(),
  finish: z.string().optional(),
  note: z.string().optional(),
})

export const getTeamHistoryEntries = createServerFn({ method: 'GET' })
  .inputValidator((data: { teamId: number }) => data)
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(teamHistoryEntries)
      .where(eq(teamHistoryEntries.teamId, data.teamId))
    return rows.sort((a, b) => b.season - a.season)
  })

export const getAllTeamHistoryEntries = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db.select().from(teamHistoryEntries)
  const allTeams = await db.select().from(teams)
  const teamMap = new Map(allTeams.map((t) => [t.id, t]))
  return rows
    .map((h) => ({ ...h, team: teamMap.get(h.teamId) ?? null }))
    .sort((a, b) => b.season - a.season)
})

export const createTeamHistoryEntry = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(TeamHistorySchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(teamHistoryEntries).values(data).returning()
    return row
  })

export const deleteTeamHistoryEntry = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(teamHistoryEntries).where(eq(teamHistoryEntries.id, data.id))
    return { success: true }
  })
