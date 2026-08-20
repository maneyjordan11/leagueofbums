import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { getAwards } from '@/server/awards.functions'

export const Route = createFileRoute('/awards')({
  loader: async () => ({ awards: await getAwards() }),
  component: AwardsPage,
})

function AwardsPage() {
  const { awards } = Route.useLoaderData()

  const bySeason = new Map<number, typeof awards>()
  for (const a of awards) {
    const list = bySeason.get(a.season) ?? []
    list.push(a)
    bySeason.set(a.season, list)
  }
  const seasons = Array.from(bySeason.keys()).sort((a, b) => b - a)

  return (
    <div>
      <PageHero
        eyebrow="Glory & Infamy"
        title="Awards"
        description="From Sharpest GM to the Wooden Spoon — every honor and every humiliation, on the record."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        {seasons.length === 0 ? (
          <div className="rounded border border-dashed border-field-line px-6 py-16 text-center text-sm text-parchment-dim">
            No awards handed out yet.
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {seasons.map((season) => (
              <div key={season}>
                <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">{season} Season</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(bySeason.get(season) ?? []).map((a) => (
                    <div key={a.id} className="rounded-lg border border-field-line bg-field-raised/50 p-6">
                      <h3 className="font-display text-xl tracking-wide text-parchment">{a.title}</h3>
                      {a.team && (
                        <Link
                          to="/teams/$teamSlug"
                          params={{ teamSlug: a.team.slug }}
                          className="mt-1 inline-block font-mono text-sm text-mustard-bright hover:text-mustard"
                        >
                          {a.team.teamName}
                        </Link>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-parchment-dim">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
