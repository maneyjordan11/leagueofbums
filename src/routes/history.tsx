import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { getChampions, getTrades, getAllTeamHistoryEntries } from '@/server/history.functions'

export const Route = createFileRoute('/history')({
  loader: async () => {
    const [champions, trades, teamHistory] = await Promise.all([
      getChampions(),
      getTrades(),
      getAllTeamHistoryEntries(),
    ])
    return { champions, trades, teamHistory }
  },
  component: HistoryPage,
})

function HistoryPage() {
  const { champions, trades, teamHistory } = Route.useLoaderData()

  const historyBySeason = new Map<number, typeof teamHistory>()
  for (const entry of teamHistory) {
    const list = historyBySeason.get(entry.season) ?? []
    list.push(entry)
    historyBySeason.set(entry.season, list)
  }
  const seasons = Array.from(historyBySeason.keys()).sort((a, b) => b - a)

  return (
    <div>
      <PageHero
        eyebrow="The Archives"
        title="League History"
        description="Every champion, every trade, and every team's rise or fall — the full paper trail nobody can dispute."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl tracking-wide text-parchment">Past Winners</h2>

        {champions.length === 0 ? (
          <EmptyState label="No champions crowned yet." />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {champions.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-mustard/30 bg-field-raised/50 p-6"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">
                  {c.season} Champion
                </p>
                {c.team ? (
                  <Link
                    to="/teams/$teamSlug"
                    params={{ teamSlug: c.team.slug }}
                    className="mt-1 block font-display text-2xl tracking-wide text-parchment hover:text-mustard-bright"
                  >
                    {c.team.teamName}
                  </Link>
                ) : (
                  <p className="mt-1 font-display text-2xl tracking-wide text-parchment">Unknown</p>
                )}
                {c.record && <p className="mt-1 font-mono text-sm text-parchment-dim">{c.record}</p>}
                <p className="mt-3 text-sm leading-relaxed text-parchment-dim">{c.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-field-line bg-field-raised/20">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl tracking-wide text-parchment">Every Trade Ever Recorded</h2>

          {trades.length === 0 ? (
            <EmptyState label="No trades recorded yet." />
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {trades.map((t) => (
                <article key={t.id} className="rounded border border-field-line bg-field-raised/50 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">
                      {t.tradeDate} {t.season ? `· ${t.season} Season` : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {t.teams.map((team) =>
                        team ? (
                          <Link
                            key={team.id}
                            to="/teams/$teamSlug"
                            params={{ teamSlug: team.slug }}
                            className="rounded border border-field-line px-2 py-1 font-mono text-xs text-parchment-dim hover:border-rust hover:text-rust-bright"
                          >
                            {team.teamName}
                          </Link>
                        ) : null,
                      )}
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-parchment">{t.summary}</p>
                  {t.details && <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{t.details}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl tracking-wide text-parchment">Team Histories</h2>

        {seasons.length === 0 ? (
          <EmptyState label="No season records logged yet." />
        ) : (
          <div className="mt-6 flex flex-col gap-8">
            {seasons.map((season) => (
              <div key={season}>
                <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">{season}</p>
                <div className="mt-3 overflow-x-auto rounded border border-field-line">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-field-line bg-field-raised/50 text-parchment-dim">
                        <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Team</th>
                        <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Record</th>
                        <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Finish</th>
                        <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(historyBySeason.get(season) ?? []).map((entry) => (
                        <tr key={entry.id} className="border-b border-field-line last:border-b-0">
                          <td className="px-4 py-3">
                            {entry.team ? (
                              <Link
                                to="/teams/$teamSlug"
                                params={{ teamSlug: entry.team.slug }}
                                className="text-parchment hover:text-mustard-bright"
                              >
                                {entry.team.teamName}
                              </Link>
                            ) : (
                              'Unknown'
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-parchment-dim">
                            {entry.wins}-{entry.losses}
                            {entry.ties ? `-${entry.ties}` : ''}
                          </td>
                          <td className="px-4 py-3 text-parchment-dim">{entry.finish ?? '—'}</td>
                          <td className="px-4 py-3 text-parchment-dim">{entry.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="mt-6 rounded border border-dashed border-field-line px-6 py-10 text-center text-sm text-parchment-dim">
      {label}
    </div>
  )
}
