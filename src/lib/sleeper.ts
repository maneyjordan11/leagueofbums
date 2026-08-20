const SLEEPER_API = 'https://api.sleeper.app/v1'

export type SleeperRoster = {
  roster_id: number
  owner_id: string | null
}

export type SleeperUser = {
  user_id: string
  display_name: string
  metadata?: { team_name?: string } | null
}

export type SleeperMatchupEntry = {
  roster_id: number
  matchup_id: number | null
  points: number | null
}

export type SleeperNflState = {
  season: string
  week: number
  season_type: string
}

async function sleeperFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${SLEEPER_API}${path}`)
  if (!res.ok) {
    throw new Error(`Sleeper API error ${res.status} for ${path}`)
  }
  return res.json()
}

export function getLeagueRosters(leagueId: string) {
  return sleeperFetch<SleeperRoster[]>(`/league/${leagueId}/rosters`)
}

export function getLeagueUsers(leagueId: string) {
  return sleeperFetch<SleeperUser[]>(`/league/${leagueId}/users`)
}

export function getLeagueMatchups(leagueId: string, week: number) {
  return sleeperFetch<SleeperMatchupEntry[]>(`/league/${leagueId}/matchups/${week}`)
}

export function getNflState() {
  return sleeperFetch<SleeperNflState>(`/state/nfl`)
}
