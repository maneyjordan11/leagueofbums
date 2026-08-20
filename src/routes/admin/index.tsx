import { createFileRoute, redirect } from '@tanstack/react-router'
import { getIsAdmin, adminLogout } from '@/lib/auth'
import { useServerFn } from '@tanstack/react-start'
import { useRouter } from '@tanstack/react-router'
import { getTeams } from '@/server/teams.functions'
import {
  getPowerRankings,
  getMatchups,
  getWeeklyPreviews,
} from '@/server/season.functions'
import { getPodcastEpisodes } from '@/server/podcast.functions'
import { getTrades, getChampions, getAllTeamHistoryEntries } from '@/server/history.functions'
import { getAwards } from '@/server/awards.functions'
import { getSyncSettings, getSleeperRosterOptions } from '@/server/sleeper.functions'
import { TeamsManager } from '@/components/admin/TeamsManager'
import { SleeperSyncManager } from '@/components/admin/SleeperSyncManager'
import { RankingsManager } from '@/components/admin/RankingsManager'
import { MatchupsManager } from '@/components/admin/MatchupsManager'
import { PreviewsManager } from '@/components/admin/PreviewsManager'
import { PodcastManager } from '@/components/admin/PodcastManager'
import { TradesManager } from '@/components/admin/TradesManager'
import { ChampionsManager } from '@/components/admin/ChampionsManager'
import { AwardsManager } from '@/components/admin/AwardsManager'
import { TeamHistoryManager } from '@/components/admin/TeamHistoryManager'

const SEASON = 2026

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const isAdmin = await getIsAdmin()
    if (!isAdmin) {
      throw redirect({ to: '/admin/login' })
    }
  },
  loader: async () => {
    const [teams, rankings, matchups, previews, episodes, trades, champions, awards, teamHistory, syncSettings] =
      await Promise.all([
        getTeams(),
        getPowerRankings({ data: { season: SEASON } }),
        getMatchups({ data: { season: SEASON } }),
        getWeeklyPreviews({ data: { season: SEASON } }),
        getPodcastEpisodes(),
        getTrades(),
        getChampions(),
        getAwards(),
        getAllTeamHistoryEntries(),
        getSyncSettings(),
      ])
    const rosterOptions = syncSettings?.sleeperLeagueId
      ? await getSleeperRosterOptions({ data: { leagueId: syncSettings.sleeperLeagueId } }).catch(() => [])
      : []
    return {
      teams,
      rankings,
      matchups,
      previews,
      episodes,
      trades,
      champions,
      awards,
      teamHistory,
      syncSettings,
      rosterOptions,
    }
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const data = Route.useLoaderData()
  const router = useRouter()
  const logout = useServerFn(adminLogout)

  const refresh = () => router.invalidate()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <div>
      <div className="border-b border-field-line bg-field-raised/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">Admin</p>
            <h1 className="mt-1 font-display text-4xl tracking-wide text-parchment">League Control Room</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded border border-field-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-parchment-dim hover:border-rust hover:text-rust-bright"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 py-16">
        <TeamsManager teams={data.teams} onChange={refresh} />
        <SleeperSyncManager
          teams={data.teams}
          syncSettings={data.syncSettings}
          rosterOptions={data.rosterOptions}
          onChange={refresh}
        />
        <RankingsManager rankings={data.rankings} teams={data.teams} season={SEASON} onChange={refresh} />
        <MatchupsManager matchups={data.matchups} teams={data.teams} season={SEASON} onChange={refresh} />
        <PreviewsManager previews={data.previews} season={SEASON} onChange={refresh} />
        <PodcastManager episodes={data.episodes} onChange={refresh} />
        <TradesManager trades={data.trades} teams={data.teams} onChange={refresh} />
        <ChampionsManager champions={data.champions} teams={data.teams} onChange={refresh} />
        <AwardsManager awards={data.awards} teams={data.teams} onChange={refresh} />
        <TeamHistoryManager entries={data.teamHistory} teams={data.teams} onChange={refresh} />
      </div>
    </div>
  )
}
