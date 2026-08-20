import { useServerFn } from '@tanstack/react-start'
import { createPowerRanking, deletePowerRanking } from '@/server/season.functions'
import { AdminSection, AdminForm, Field, TextAreaField, SelectField, ListRow } from './shared'

type Team = { id: number; teamName: string }
type Ranking = {
  id: number
  week: number
  rank: number
  blurb: string | null
  trend: string | null
  teamName: string
}

export function RankingsManager({
  rankings,
  teams,
  season,
  onChange,
}: {
  rankings: Ranking[]
  teams: Team[]
  season: number
  onChange: () => void
}) {
  const create = useServerFn(createPowerRanking)
  const remove = useServerFn(deletePowerRanking)

  return (
    <AdminSection title="Power Rankings">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              season,
              week: Number(fd.get('week')),
              teamId: Number(fd.get('teamId')),
              rank: Number(fd.get('rank')),
              blurb: String(fd.get('blurb') || ''),
              trend: (String(fd.get('trend') || 'same') as 'up' | 'down' | 'same'),
            },
          })
          onChange()
        }}
      >
        <Field name="week" label="Week" type="number" required />
        <Field name="rank" label="Rank" type="number" required />
        <SelectField
          name="teamId"
          label="Team"
          options={teams.map((t) => ({ value: String(t.id), label: t.teamName }))}
        />
        <SelectField
          name="trend"
          label="Trend"
          options={[
            { value: 'up', label: 'Up' },
            { value: 'down', label: 'Down' },
            { value: 'same', label: 'Same' },
          ]}
        />
        <TextAreaField name="blurb" label="Blurb" full />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {rankings.map((r) => (
          <ListRow
            key={r.id}
            onDelete={async () => {
              await remove({ data: { id: r.id } })
              onChange()
            }}
          >
            Week {r.week} — #{r.rank} <span className="font-semibold text-parchment">{r.teamName}</span>
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
