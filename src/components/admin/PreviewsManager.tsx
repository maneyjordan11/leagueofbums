import { useServerFn } from '@tanstack/react-start'
import { createWeeklyPreview, deleteWeeklyPreview } from '@/server/season.functions'
import { AdminSection, AdminForm, Field, TextAreaField, ListRow } from './shared'

type Preview = { id: number; week: number; title: string }

export function PreviewsManager({
  previews,
  season,
  onChange,
}: {
  previews: Preview[]
  season: number
  onChange: () => void
}) {
  const create = useServerFn(createWeeklyPreview)
  const remove = useServerFn(deleteWeeklyPreview)

  return (
    <AdminSection title="Weekly Previews">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              season,
              week: Number(fd.get('week')),
              title: String(fd.get('title')),
              content: String(fd.get('content') || ''),
            },
          })
          onChange()
        }}
      >
        <Field name="week" label="Week" type="number" required />
        <Field name="title" label="Title" required full />
        <TextAreaField name="content" label="Content" full />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {previews.map((p) => (
          <ListRow
            key={p.id}
            onDelete={async () => {
              await remove({ data: { id: p.id } })
              onChange()
            }}
          >
            Week {p.week} — <span className="font-semibold text-parchment">{p.title}</span>
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
