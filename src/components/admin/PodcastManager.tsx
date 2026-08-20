import { useServerFn } from '@tanstack/react-start'
import { createPodcastEpisode, deletePodcastEpisode } from '@/server/podcast.functions'
import { AdminSection, AdminForm, Field, TextAreaField, ListRow } from './shared'

type Episode = { id: number; title: string; episodeNumber: number | null }

export function PodcastManager({ episodes, onChange }: { episodes: Episode[]; onChange: () => void }) {
  const create = useServerFn(createPodcastEpisode)
  const remove = useServerFn(deletePodcastEpisode)

  return (
    <AdminSection title="ManeyCast Episodes">
      <AdminForm
        onSubmit={async (fd) => {
          await create({
            data: {
              title: String(fd.get('title')),
              description: String(fd.get('description') || ''),
              driveUrl: String(fd.get('driveUrl')),
              episodeNumber: fd.get('episodeNumber') ? Number(fd.get('episodeNumber')) : undefined,
            },
          })
          onChange()
        }}
      >
        <Field name="title" label="Episode Title" required />
        <Field name="episodeNumber" label="Episode Number" type="number" />
        <Field
          name="driveUrl"
          label="Google Drive Link"
          required
          full
          placeholder="https://drive.google.com/file/d/.../view"
        />
        <TextAreaField name="description" label="Description" full />
      </AdminForm>

      <div className="flex flex-col gap-2">
        {episodes.map((e) => (
          <ListRow
            key={e.id}
            onDelete={async () => {
              await remove({ data: { id: e.id } })
              onChange()
            }}
          >
            {e.episodeNumber ? `Ep. ${e.episodeNumber} — ` : ''}
            <span className="font-semibold text-parchment">{e.title}</span>
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
