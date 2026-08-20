import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { getPodcastEpisodes } from '@/server/podcast.functions'

export const Route = createFileRoute('/podcast')({
  loader: async () => ({ episodes: await getPodcastEpisodes() }),
  component: PodcastPage,
})

function toDriveEmbedUrl(driveUrl: string) {
  const match = driveUrl.match(/\/d\/([^/]+)/)
  if (!match) return null
  return `https://drive.google.com/file/d/${match[1]}/preview`
}

function PodcastPage() {
  const { episodes } = Route.useLoaderData()

  return (
    <div>
      <PageHero
        eyebrow="The Official Podcast"
        title="ManeyCast"
        description="Weekly reactions, trade breakdowns, and league gossip — recorded, uploaded, and occasionally coherent."
      />

      <section className="mx-auto max-w-4xl px-5 py-16">
        {episodes.length === 0 ? (
          <div className="rounded border border-dashed border-field-line px-6 py-16 text-center text-sm text-parchment-dim">
            No episodes uploaded yet. Check back after the next recording session.
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {episodes.map((ep) => {
              const embedUrl = toDriveEmbedUrl(ep.driveUrl)
              return (
                <article
                  key={ep.id}
                  className="overflow-hidden rounded-lg border border-field-line bg-field-raised/50"
                >
                  <div className="aspect-video w-full bg-field">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        className="h-full w-full"
                        allow="autoplay"
                        title={ep.title}
                      />
                    ) : (
                      <a
                        href={ep.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-full w-full items-center justify-center font-mono text-sm uppercase tracking-widest text-mustard-bright hover:text-mustard"
                      >
                        Open on Google Drive →
                      </a>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">
                      {ep.episodeNumber ? `Episode ${ep.episodeNumber}` : 'Episode'}
                    </p>
                    <h2 className="mt-1 font-display text-2xl tracking-wide text-parchment">{ep.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-parchment-dim">{ep.description}</p>
                    <a
                      href={ep.driveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-rust-bright hover:text-rust"
                    >
                      View on Google Drive →
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
