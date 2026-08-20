import { eq } from 'drizzle-orm'
import { db } from '../../db/index'
import { teams, matchups, leagueSyncSettings } from '../../db/schema'
import { getLeagueMatchups, getNflState, type SleeperMatchupEntry } from './sleeper'

// Sleeper leagues generate the full-season schedule up front, so scanning every regular-season
// week (not just the ones already played) is what lets the sync fill in upcoming matchups too.
const MAX_WEEK = 18

type SyncResult = { success: boolean; message: string }

export async function runSleeperSync(): Promise<SyncResult> {
  const [settings] = await db.select().from(leagueSyncSettings).limit(1)
  if (!settings?.sleeperLeagueId) {
    return { success: false, message: 'No Sleeper league ID configured yet.' }
  }

  const finish = async (status: 'success' | 'error', message: string): Promise<SyncResult> => {
    await db
      .update(leagueSyncSettings)
      .set({ lastSyncedAt: new Date(), lastSyncStatus: status, lastSyncMessage: message })
      .where(eq(leagueSyncSettings.id, settings.id))
    return { success: status === 'success', message }
  }

  const allTeams = await db.select().from(teams)
  const teamByRosterId = new Map(
    allTeams.filter((t) => t.sleeperRosterId != null).map((t) => [t.sleeperRosterId as number, t]),
  )
  if (teamByRosterId.size === 0) {
    return finish('error', 'No teams are mapped to Sleeper rosters yet — map them in the admin dashboard.')
  }

  try {
    let nflWeek = MAX_WEEK
    try {
      const nflState = await getNflState()
      if (nflState?.week) nflWeek = nflState.week
    } catch {
      // Sleeper's state endpoint being unavailable shouldn't block the rest of the sync —
      // fall back to treating every week as "in progress" rather than complete.
    }

    const weeks = Array.from({ length: MAX_WEEK }, (_, i) => i + 1)
    const weeklyEntries = await Promise.all(
      weeks.map((week) =>
        getLeagueMatchups(settings.sleeperLeagueId as string, week).catch(() => [] as SleeperMatchupEntry[]),
      ),
    )

    const existingRows = await db.select().from(matchups).where(eq(matchups.season, settings.season))
    const existingByKey = new Map(
      existingRows.map((row) => [
        `${row.week}:${Math.min(row.teamAId, row.teamBId)}-${Math.max(row.teamAId, row.teamBId)}`,
        row,
      ]),
    )

    const writes: Promise<unknown>[] = []
    let written = 0
    let skippedOverrides = 0

    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i]
      const entries = weeklyEntries[i]
      if (!entries?.length) continue

      // Median-scoring leagues group every roster under one matchup_id; only head-to-head
      // pairs of exactly two rosters map cleanly onto this site's matchups table.
      const byMatchupId = new Map<number, SleeperMatchupEntry[]>()
      for (const entry of entries) {
        if (entry.matchup_id == null) continue
        const list = byMatchupId.get(entry.matchup_id) ?? []
        list.push(entry)
        byMatchupId.set(entry.matchup_id, list)
      }

      for (const pair of byMatchupId.values()) {
        if (pair.length !== 2) continue
        const [a, b] = pair
        const teamA = teamByRosterId.get(a.roster_id)
        const teamB = teamByRosterId.get(b.roster_id)
        if (!teamA || !teamB) continue

        const key = `${week}:${Math.min(teamA.id, teamB.id)}-${Math.max(teamA.id, teamB.id)}`
        const existing = existingByKey.get(key)
        if (existing?.manualOverride) {
          skippedOverrides++
          continue
        }

        const values = {
          season: settings.season,
          week,
          teamAId: teamA.id,
          teamBId: teamB.id,
          teamAScore: a.points ?? 0,
          teamBScore: b.points ?? 0,
          isComplete: week < nflWeek,
          sleeperSyncedAt: new Date(),
        }

        writes.push(
          existing
            ? db.update(matchups).set(values).where(eq(matchups.id, existing.id))
            : db.insert(matchups).values(values),
        )
        written++
      }
    }

    await Promise.all(writes)

    const message = `Synced ${written} matchup${written === 1 ? '' : 's'} through week ${nflWeek}${
      skippedOverrides ? ` (${skippedOverrides} skipped — manually overridden)` : ''
    }.`
    return finish('success', message)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during Sleeper sync.'
    return finish('error', message)
  }
}
