import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/PageHero'
import { getPowerRankings } from '@/server/season.functions'
import { getMatchups } from '@/server/season.functions'
import { getWeeklyPreviews } from '@/server/season.functions'

const SEASON = 2026

export const Route = createFileRoute('/season')({
  loader: async () => {
    const [rankings, matchups, previews] = await Promise.all([
      getPowerRankings({ data: { season: SEASON } }),
      getMatchups({ data: { season: SEASON } }),
      getWeeklyPreviews({ data: { season: SEASON } }),
    ])
    return { rankings, matchups, previews }
  },
  component: SeasonPage,
})

const trendGlyph: Record<string, string> = { up: '▲', down: '▼', same: '—' }
const trendColor: Record<string, string> = {
  up: 'text-turf',
  down: 'text-rust-bright',
  same: 'text-parchment-dim',
}

function SeasonPage() {
  const { rankings, matchups, previews } = Route.useLoaderData()

  const weeks = Array.from(new Set(rankings.map((r) => r.week))).sort((a, b) => b - a)
  const latestWeek = weeks[0]
  const latestRankings = rankings.filter((r) => r.week === latestWeek).sort((a, b) => a.rank - b.rank)

  const matchupWeeks = Array.from(new Set(matchups.map((m) => m.week))).sort((a, b) => a - b)

  return (
    <div>
      <PageHero
        eyebrow={`${SEASON} Season`}
        title="Rankings, Rivalries & Reckonings"
        description="Everything happening in League of Bums right now: who's actually good, who's playing who, and what to expect before kickoff."
      />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl tracking-wide text-parchment">Power Rankings</h2>
          {latestWeek && (
            <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">
              Week {latestWeek}
            </span>
          )}
        </div>

        {latestRankings.length === 0 ? (
          <EmptyState label="No power rankings posted yet." />
        ) : (
          <ol className="mt-6 flex flex-col gap-2">
            {latestRankings.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-4 rounded border border-field-line bg-field-raised/50 px-4 py-3"
              >
                <span className="font-display w-10 text-2xl text-mustard-bright">{r.rank}</span>
                <div className="flex-1">
                  <p className="font-semibold text-parchment">{r.teamName}</p>
                  <p className="text-sm text-parchment-dim">{r.blurb || `Managed by ${r.managerName}`}</p>
                </div>
                <span className={`font-mono text-sm ${trendColor[r.trend] ?? 'text-parchment-dim'}`}>
                  {trendGlyph[r.trend] ?? '—'}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="border-t border-field-line bg-field-raised/20">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl tracking-wide text-parchment">Head-to-Head Matchups</h2>

          {matchupWeeks.length === 0 ? (
            <EmptyState label="No matchups scheduled yet." />
          ) : (
            <div className="mt-6 flex flex-col gap-10">
              {matchupWeeks.map((week) => (
                <div key={week}>
                  <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">
                    Week {week}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {matchups
                      .filter((m) => m.week === week)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="rounded border border-field-line bg-field-raised/50 p-4"
                        >
                          <MatchupRow
                            name={m.teamA?.teamName ?? 'TBD'}
                            score={m.teamAScore}
                            winner={m.isComplete && (m.teamAScore ?? 0) > (m.teamBScore ?? 0)}
                          />
                          <div className="my-2 border-t border-dashed border-field-line" />
                          <MatchupRow
                            name={m.teamB?.teamName ?? 'TBD'}
                            score={m.teamBScore}
                            winner={m.isComplete && (m.teamBScore ?? 0) > (m.teamAScore ?? 0)}
                          />
                          {!m.isComplete && (
                            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-parchment-dim">
                              Upcoming
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl tracking-wide text-parchment">Weekly Previews</h2>

        {previews.length === 0 ? (
          <EmptyState label="No previews written yet." />
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            {previews.map((p) => (
              <article key={p.id} className="rounded border border-field-line bg-field-raised/50 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">
                  Week {p.week}
                </p>
                <h3 className="mt-1 font-display text-2xl tracking-wide text-parchment">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-parchment-dim">{p.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function MatchupRow({ name, score, winner }: { name: string; score: number | null; winner: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={winner ? 'font-semibold text-parchment' : 'text-parchment-dim'}>{name}</span>
      <span className={`font-mono ${winner ? 'text-mustard-bright' : 'text-parchment-dim'}`}>
        {score == null ? '–' : Number.isInteger(score) ? score : score.toFixed(2)}
      </span>
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
