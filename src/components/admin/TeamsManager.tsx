import { useServerFn } from '@tanstack/react-start'
import { createTeam, deleteTeam } from '@/server/teams.functions'
import { AdminSection, AdminForm, Field, TextAreaField, ListRow } from './shared'

type Team = {
  id: number
  slug: string
  teamName: string
  managerName: string
  motto: string | null
}

export function TeamsManager({ teams, onChange }: { teams: Team[]; onChange: () => void }) {
  const create = useServerFn(createTeam)
  const remove = useServerFn(deleteTeam)

  return (
    <AdminSection title="Teams">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              slug: String(fd.get('slug')),
              teamName: String(fd.get('teamName')),
              managerName: String(fd.get('managerName')),
              motto: String(fd.get('motto') || ''),
              teamBio: String(fd.get('teamBio') || ''),
              managerBio: String(fd.get('managerBio') || ''),
              founded: fd.get('founded') ? Number(fd.get('founded')) : undefined,
            },
          })
          onChange()
        }}
      >
        <Field name="slug" label="Slug (url-safe)" required placeholder="couch-cushions" />
        <Field name="teamName" label="Team Name" required />
        <Field name="managerName" label="Manager Name" required />
        <Field name="motto" label="Motto" />
        <Field name="founded" label="Founded Year" type="number" />
        <TextAreaField name="teamBio" label="Team Bio" full />
        <TextAreaField name="managerBio" label="Manager Bio" full />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {teams.map((t) => (
          <ListRow
            key={t.id}
            onDelete={async () => {
              await remove({ data: { id: t.id } })
              onChange()
            }}
          >
            <span className="font-semibold text-parchment">{t.teamName}</span> — {t.managerName}{' '}
            <span className="font-mono text-xs">({t.slug})</span>
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
