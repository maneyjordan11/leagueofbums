import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index'
import { leagueSyncSettings, teams } from '../../db/schema'
import { requireAdminMiddleware } from '../lib/auth'
import { runSleeperSync } from '../lib/sleeperSync'
import { getLeagueRosters, getLeagueUsers } from '../lib/sleeper'

export const getSyncSettings = createServerFn({ method: 'GET' }).handler(async () => {
  const [settings] = await db.select().from(leagueSyncSettings).limit(1)
  return settings ?? null
})

const SyncSettingsSchema = z.object({
  sleeperLeagueId: z.string().min(1),
  season: z.number().int(),
})

export const updateSyncSettings = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(SyncSettingsSchema)
  .handler(async ({ data }) => {
    const [existing] = await db.select().from(leagueSyncSettings).limit(1)
    if (existing) {
      const [row] = await db
        .update(leagueSyncSettings)
        .set({ sleeperLeagueId: data.sleeperLeagueId, season: data.season })
        .where(eq(leagueSyncSettings.id, existing.id))
        .returning()
      return row
    }
    const [row] = await db.insert(leagueSyncSettings).values(data).returning()
    return row
  })

export const getSleeperRosterOptions = createServerFn({ method: 'GET' })
  .inputValidator((data: { leagueId: string }) => data)
  .handler(async ({ data }) => {
    const [rosters, users] = await Promise.all([
      getLeagueRosters(data.leagueId),
      getLeagueUsers(data.leagueId),
    ])
    const userById = new Map(users.map((u) => [u.user_id, u]))
    return rosters.map((r) => {
      const user = r.owner_id ? userById.get(r.owner_id) : undefined
      return {
        rosterId: r.roster_id,
        label: user?.metadata?.team_name || user?.display_name || `Roster ${r.roster_id}`,
      }
    })
  })

export const updateTeamRosterMapping = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { teamId: number; sleeperRosterId: number | null }) => data)
  .handler(async ({ data }) => {
    const [row] = await db
      .update(teams)
      .set({ sleeperRosterId: data.sleeperRosterId })
      .where(eq(teams.id, data.teamId))
      .returning()
    return row
  })

export const triggerSleeperSync = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .handler(async () => {
    return runSleeperSync()
  })
