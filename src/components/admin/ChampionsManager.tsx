import { useServerFn } from '@tanstack/react-start'
import { createChampion, deleteChampion } from '@/server/history.functions'
import { AdminSection, AdminForm, Field, TextAreaField, SelectField, ListRow } from './shared'

type Team = { id: number; teamName: string }
type Champion = { id: number; season: number; record: string | null; team: Team | null }

export function ChampionsManager({
  champions,
  teams,
  onChange,
}: {
  champions: Champion[]
  teams: Team[]
  onChange: () => void
}) {
  const create = useServerFn(createChampion)
  const remove = useServerFn(deleteChampion)

  return (
    <AdminSection title="Past Winners">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              season: Number(fd.get('season')),
              teamId: Number(fd.get('teamId')),
              record: String(fd.get('record') || ''),
              note: String(fd.get('note') || ''),
            },
          })
          onChange()
        }}
      >
        <Field name="season" label="Season" type="number" required />
        <SelectField
          name="teamId"
          label="Champion"
          options={teams.map((t) => ({ value: String(t.id), label: t.teamName }))}
        />
        <Field name="record" label="Record" placeholder="11-3" />
        <TextAreaField name="note" label="Note" full />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {champions.map((c) => (
          <ListRow
            key={c.id}
            onDelete={async () => {
              await remove({ data: { id: c.id } })
              onChange()
            }}
          >
            {c.season} — <span className="font-semibold text-parchment">{c.team?.teamName ?? 'Unknown'}</span>
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
