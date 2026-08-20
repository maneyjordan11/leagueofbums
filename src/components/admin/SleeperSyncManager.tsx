import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import {
  updateSyncSettings,
  updateTeamRosterMapping,
  triggerSleeperSync,
  getSleeperRosterOptions,
} from '@/server/sleeper.functions'
import { AdminSection } from './shared'

type Team = { id: number; teamName: string; sleeperRosterId: number | null }
type RosterOption = { rosterId: number; label: string }
type SyncSettings = {
  id: number
  sleeperLeagueId: string | null
  season: number
  lastSyncedAt: string | null
  lastSyncStatus: string | null
  lastSyncMessage: string
} | null

const inputClass =
  'rounded border border-field-line bg-field px-3 py-2 text-parchment outline-none focus:border-mustard'

export function SleeperSyncManager({
  teams,
  syncSettings,
  rosterOptions,
  onChange,
}: {
  teams: Team[]
  syncSettings: SyncSettings
  rosterOptions: RosterOption[]
  onChange: () => void
}) {
  const saveSettings = useServerFn(updateSyncSettings)
  const saveMapping = useServerFn(updateTeamRosterMapping)
  const runSync = useServerFn(triggerSleeperSync)
  const loadRosters = useServerFn(getSleeperRosterOptions)

  const [leagueId, setLeagueId] = useState(syncSettings?.sleeperLeagueId ?? '')
  const [season, setSeason] = useState(syncSettings?.season ?? new Date().getFullYear())
  const [rosters, setRosters] = useState(rosterOptions)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSaveSettings = async () => {
    setBusy(true)
    await saveSettings({ data: { sleeperLeagueId: leagueId, season } })
    const options = leagueId ? await loadRosters({ data: { leagueId } }) : []
    setRosters(options)
    setBusy(false)
    onChange()
  }

  const handleSyncNow = async () => {
    setBusy(true)
    setMessage(null)
    const result = await runSync()
    setMessage(result.message)
    setBusy(false)
    onChange()
  }

  return (
    <AdminSection title="Sleeper Sync">
      <div className="rounded-lg border border-field-line bg-field-raised/40 p-5">
        <p className="text-sm text-parchment-dim">
          Matchups, schedule, and scoring can sync automatically from a Sleeper league. Map each team to its
          Sleeper roster below — a background job then keeps synced matchups current, while anything edited by
          hand here is left alone until you choose to resync it.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">
              Sleeper League ID
            </span>
            <input
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              className={inputClass}
              placeholder="1312192910556405760"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">Season</span>
            <input
              type="number"
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveSettings}
            disabled={busy}
            className="rounded bg-mustard px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-field hover:bg-mustard-bright disabled:opacity-50"
          >
            Save & Load Rosters
          </button>
          <button
            onClick={handleSyncNow}
            disabled={busy || !syncSettings?.sleeperLeagueId}
            className="rounded border border-field-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-parchment-dim hover:border-mustard hover:text-mustard-bright disabled:opacity-50"
          >
            Sync Now
          </button>
        </div>
        {(message ?? syncSettings?.lastSyncMessage) && (
          <p className="mt-3 text-sm text-parchment-dim">
            {message ?? syncSettings?.lastSyncMessage}
            {syncSettings?.lastSyncedAt && !message && (
              <span className="ml-2 font-mono text-xs text-parchment-dim/70">
                (last synced {new Date(syncSettings.lastSyncedAt).toLocaleString()})
              </span>
            )}
          </p>
        )}
      </div>

      <div className="rounded-lg border border-field-line bg-field-raised/40 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-parchment-dim">
          Map Teams to Sleeper Rosters
        </p>
        {rosters.length === 0 ? (
          <p className="mt-3 text-sm text-parchment-dim">
            Save a league ID above to load Sleeper rosters for mapping.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {teams.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-4 rounded border border-field-line bg-field-raised/30 px-4 py-3"
              >
                <span className="text-sm text-parchment">{t.teamName}</span>
                <select
                  className={inputClass}
                  value={t.sleeperRosterId ?? ''}
                  onChange={async (e) => {
                    const value = e.target.value
                    await saveMapping({
                      data: { teamId: t.id, sleeperRosterId: value ? Number(value) : null },
                    })
                    onChange()
                  }}
                >
                  <option value="">Not mapped</option>
                  {rosters.map((r) => (
                    <option key={r.rosterId} value={r.rosterId}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminSection>
  )
}
