import { useServerFn } from '@tanstack/react-start'
import { createAward, deleteAward } from '@/server/awards.functions'
import { AdminSection, AdminForm, Field, TextAreaField, SelectField, ListRow } from './shared'

type Team = { id: number; teamName: string }
type Award = { id: number; season: number; title: string; team: Team | null }

export function AwardsManager({
  awards,
  teams,
  onChange,
}: {
  awards: Award[]
  teams: Team[]
  onChange: () => void
}) {
  const create = useServerFn(createAward)
  const remove = useServerFn(deleteAward)

  return (
    <AdminSection title="Awards">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              season: Number(fd.get('season')),
              title: String(fd.get('title')),
              teamId: fd.get('teamId') ? Number(fd.get('teamId')) : undefined,
              description: String(fd.get('description') || ''),
            },
          })
          onChange()
        }}
      >
        <Field name="season" label="Season" type="number" required />
        <Field name="title" label="Award Title" required />
        <SelectField
          name="teamId"
          label="Team (optional)"
          options={[{ value: '', label: '— None —' }, ...teams.map((t) => ({ value: String(t.id), label: t.teamName }))]}
        />
        <TextAreaField name="description" label="Description" full />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {awards.map((a) => (
          <ListRow
            key={a.id}
            onDelete={async () => {
              await remove({ data: { id: a.id } })
              onChange()
            }}
          >
            {a.season} — <span className="font-semibold text-parchment">{a.title}</span>{' '}
            {a.team && <span className="font-mono text-xs">({a.team.teamName})</span>}
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
