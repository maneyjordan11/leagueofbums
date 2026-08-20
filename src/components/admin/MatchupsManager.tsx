import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { createMatchup, deleteMatchup, updateMatchup } from '@/server/season.functions'
import { AdminSection, AdminForm, Field, SelectField } from './shared'

type Team = { id: number; teamName: string }
type Matchup = {
  id: number
  week: number
  teamAId: number
  teamBId: number
  teamA: Team | null
  teamB: Team | null
  teamAScore: number | null
  teamBScore: number | null
  isComplete: boolean
  manualOverride: boolean
}

export function MatchupsManager({
  matchups,
  teams,
  season,
  onChange,
}: {
  matchups: Matchup[]
  teams: Team[]
  season: number
  onChange: () => void
}) {
  const create = useServerFn(createMatchup)
  const remove = useServerFn(deleteMatchup)
  const update = useServerFn(updateMatchup)

  return (
    <AdminSection title="Matchups">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              season,
              week: Number(fd.get('week')),
              teamAId: Number(fd.get('teamAId')),
              teamBId: Number(fd.get('teamBId')),
              teamAScore: fd.get('teamAScore') ? Number(fd.get('teamAScore')) : undefined,
              teamBScore: fd.get('teamBScore') ? Number(fd.get('teamBScore')) : undefined,
              isComplete: fd.get('isComplete') === 'true',
            },
          })
          onChange()
        }}
      >
        <Field name="week" label="Week" type="number" required />
        <SelectField
          name="teamAId"
          label="Team A"
          options={teams.map((t) => ({ value: String(t.id), label: t.teamName }))}
        />
        <SelectField
          name="teamBId"
          label="Team B"
          options={teams.map((t) => ({ value: String(t.id), label: t.teamName }))}
        />
        <Field name="teamAScore" label="Team A Score" type="number" />
        <Field name="teamBScore" label="Team B Score" type="number" />
        <SelectField
          name="isComplete"
          label="Status"
          options={[
            { value: 'false', label: 'Upcoming' },
            { value: 'true', label: 'Complete' },
          ]}
        />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {matchups.map((m) => (
          <MatchupRow
            key={m.id}
            matchup={m}
            onSave={async (values) => {
              await update({
                data: {
                  id: m.id,
                  season,
                  week: m.week,
                  teamAId: m.teamAId,
                  teamBId: m.teamBId,
                  ...values,
                  manualOverride: true,
                },
              })
              onChange()
            }}
            onClearOverride={async () => {
              await update({
                data: {
                  id: m.id,
                  season,
                  week: m.week,
                  teamAId: m.teamAId,
                  teamBId: m.teamBId,
                  teamAScore: m.teamAScore ?? undefined,
                  teamBScore: m.teamBScore ?? undefined,
                  isComplete: m.isComplete,
                  manualOverride: false,
                },
              })
              onChange()
            }}
            onDelete={async () => {
              await remove({ data: { id: m.id } })
              onChange()
            }}
          />
        ))}
      </div>
    </AdminSection>
  )
}

function MatchupRow({
  matchup,
  onSave,
  onClearOverride,
  onDelete,
}: {
  matchup: Matchup
  onSave: (values: { teamAScore?: number; teamBScore?: number; isComplete: boolean }) => Promise<void>
  onClearOverride: () => Promise<void>
  onDelete: () => Promise<void>
}) {
  const [teamAScore, setTeamAScore] = useState(matchup.teamAScore?.toString() ?? '')
  const [teamBScore, setTeamBScore] = useState(matchup.teamBScore?.toString() ?? '')
  const [isComplete, setIsComplete] = useState(matchup.isComplete)

  return (
    <div className="flex flex-col gap-3 rounded border border-field-line bg-field-raised/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3 text-sm text-parchment-dim">
        <span className="font-mono text-xs uppercase tracking-widest text-mustard-bright">
          Week {matchup.week}
        </span>
        <span>{matchup.teamA?.teamName ?? '?'}</span>
        <input
          value={teamAScore}
          onChange={(e) => setTeamAScore(e.target.value)}
          type="number"
          step="0.01"
          className="w-20 rounded border border-field-line bg-field px-2 py-1 text-parchment outline-none focus:border-mustard"
        />
        <span>vs</span>
        <input
          value={teamBScore}
          onChange={(e) => setTeamBScore(e.target.value)}
          type="number"
          step="0.01"
          className="w-20 rounded border border-field-line bg-field px-2 py-1 text-parchment outline-none focus:border-mustard"
        />
        <span>{matchup.teamB?.teamName ?? '?'}</span>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={isComplete} onChange={(e) => setIsComplete(e.target.checked)} />
          Complete
        </label>
        <span
          className={`rounded px-2 py-0.5 font-mono text-xs uppercase tracking-widest ${
            matchup.manualOverride ? 'bg-rust/30 text-rust-bright' : 'bg-turf/20 text-turf'
          }`}
        >
          {matchup.manualOverride ? 'Manual' : 'Synced'}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() =>
            onSave({
              teamAScore: teamAScore ? Number(teamAScore) : undefined,
              teamBScore: teamBScore ? Number(teamBScore) : undefined,
              isComplete,
            })
          }
          className="rounded bg-mustard px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-field hover:bg-mustard-bright"
        >
          Save
        </button>
        {matchup.manualOverride && (
          <button
            onClick={onClearOverride}
            className="rounded border border-field-line px-3 py-1 font-mono text-xs uppercase tracking-widest text-parchment-dim hover:border-mustard hover:text-mustard-bright"
          >
            Resync
          </button>
        )}
        <button
          onClick={onDelete}
          className="rounded border border-field-line px-3 py-1 font-mono text-xs uppercase tracking-widest text-parchment-dim hover:border-rust hover:text-rust-bright"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
