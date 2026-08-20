import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getTeamBySlug } from '@/server/teams.functions'
import { getTeamHistoryEntries } from '@/server/history.functions'

export const Route = createFileRoute('/teams/$teamSlug')({
  loader: async ({ params }) => {
    const team = await getTeamBySlug({ data: { slug: params.teamSlug } })
    if (!team) throw notFound()
    const history = await getTeamHistoryEntries({ data: { teamId: team.id } })
    return { team, history }
  },
  component: TeamProfilePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-display text-3xl text-parchment">Team not found.</p>
      <Link to="/teams" className="mt-4 inline-block font-mono text-sm text-mustard-bright hover:text-mustard">
        ← Back to all teams
      </Link>
    </div>
  ),
})

function TeamProfilePage() {
  const { team, history } = Route.useLoaderData()

  const totalWins = history.reduce((sum, h) => sum + h.wins, 0)
  const totalLosses = history.reduce((sum, h) => sum + h.losses, 0)

  return (
    <div>
      <div className="border-b border-field-line bg-field-raised/60">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <Link to="/teams" className="font-mono text-xs uppercase tracking-widest text-parchment-dim hover:text-mustard-bright">
            ← All Teams
          </Link>
          <div className="mt-4 flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-mustard font-display text-2xl text-mustard-bright">
              {team.teamName
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <h1 className="font-display text-4xl tracking-wide text-parchment sm:text-5xl">{team.teamName}</h1>
              <p className="mt-1 font-mono text-sm text-mustard-bright">Managed by {team.managerName}</p>
            </div>
          </div>
          {team.motto && <p className="mt-5 max-w-xl text-lg italic leading-relaxed text-parchment-dim">"{team.motto}"</p>}
          {history.length > 0 && (
            <p className="mt-4 font-mono text-sm text-parchment-dim">
              All-time record: {totalWins}-{totalLosses}
            </p>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl tracking-wide text-parchment">Team Bio</h2>
            <p className="mt-3 text-sm leading-relaxed text-parchment-dim">
              {team.teamBio || 'No team bio written yet.'}
            </p>
            {team.founded && (
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-parchment-dim">
                Founded {team.founded}
              </p>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl tracking-wide text-parchment">Manager Bio</h2>
            <p className="mt-3 text-sm leading-relaxed text-parchment-dim">
              {team.managerBio || 'No manager bio written yet.'}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-field-line bg-field-raised/20">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="font-display text-2xl tracking-wide text-parchment">Season-by-Season</h2>
          {history.length === 0 ? (
            <p className="mt-4 text-sm text-parchment-dim">No season records logged yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded border border-field-line">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-field-line bg-field-raised/50 text-parchment-dim">
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Season</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Record</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Finish</th>
                    <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-field-line last:border-b-0">
                      <td className="px-4 py-3 font-mono text-parchment">{h.season}</td>
                      <td className="px-4 py-3 font-mono text-parchment-dim">
                        {h.wins}-{h.losses}
                        {h.ties ? `-${h.ties}` : ''}
                      </td>
                      <td className="px-4 py-3 text-parchment-dim">{h.finish ?? '—'}</td>
                      <td className="px-4 py-3 text-parchment-dim">{h.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
