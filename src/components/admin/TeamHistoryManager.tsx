import { useServerFn } from '@tanstack/react-start'
import { createTeamHistoryEntry, deleteTeamHistoryEntry } from '@/server/history.functions'
import { AdminSection, AdminForm, Field, TextAreaField, SelectField, ListRow } from './shared'

type Team = { id: number; teamName: string }
type Entry = {
  id: number
  season: number
  wins: number
  losses: number
  ties: number
  finish: string | null
  team: Team | null
}

export function TeamHistoryManager({
  entries,
  teams,
  onChange,
}: {
  entries: Entry[]
  teams: Team[]
  onChange: () => void
}) {
  const create = useServerFn(createTeamHistoryEntry)
  const remove = useServerFn(deleteTeamHistoryEntry)

  return (
    <AdminSection title="Team Histories">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              teamId: Number(fd.get('teamId')),
              season: Number(fd.get('season')),
              wins: Number(fd.get('wins') || 0),
              losses: Number(fd.get('losses') || 0),
              ties: Number(fd.get('ties') || 0),
              finish: String(fd.get('finish') || ''),
              note: String(fd.get('note') || ''),
            },
          })
          onChange()
        }}
      >
        <SelectField
          name="teamId"
          label="Team"
          options={teams.map((t) => ({ value: String(t.id), label: t.teamName }))}
        />
        <Field name="season" label="Season" type="number" required />
        <Field name="wins" label="Wins" type="number" />
        <Field name="losses" label="Losses" type="number" />
        <Field name="ties" label="Ties" type="number" />
        <Field name="finish" label="Finish" placeholder="1st Place" />
        <TextAreaField name="note" label="Note" full />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {entries.map((e) => (
          <ListRow
            key={e.id}
            onDelete={async () => {
              await remove({ data: { id: e.id } })
              onChange()
            }}
          >
            {e.season} — <span className="font-semibold text-parchment">{e.team?.teamName ?? 'Unknown'}</span> (
            {e.wins}-{e.losses}
            {e.ties ? `-${e.ties}` : ''})
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
