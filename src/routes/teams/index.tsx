import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { getTeams } from '@/server/teams.functions'

export const Route = createFileRoute('/teams/')({
  loader: async () => ({ teams: await getTeams() }),
  component: TeamsPage,
})

function TeamsPage() {
  const { teams } = Route.useLoaderData()

  return (
    <div>
      <PageHero
        eyebrow="The Rosters"
        title="Teams & Managers"
        description="Ten teams. Ten managers. Wildly varying levels of preparation."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        {teams.length === 0 ? (
          <div className="rounded border border-dashed border-field-line px-6 py-16 text-center text-sm text-parchment-dim">
            No teams added yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Link
                key={team.id}
                to="/teams/$teamSlug"
                params={{ teamSlug: team.slug }}
                className="group flex flex-col gap-3 rounded-lg border border-field-line bg-field-raised/50 p-6 transition hover:border-mustard/50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-field-line font-display text-lg text-mustard-bright group-hover:border-mustard">
                    {team.teamName
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <div>
                    <h2 className="font-display text-xl tracking-wide text-parchment">{team.teamName}</h2>
                    <p className="font-mono text-xs text-parchment-dim">{team.managerName}</p>
                  </div>
                </div>
                {team.motto && <p className="text-sm italic leading-relaxed text-parchment-dim">"{team.motto}"</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
