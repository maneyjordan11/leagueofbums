import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const SECTIONS = [
  {
    to: '/season' as const,
    label: '2026 Season',
    desc: 'Power rankings, head-to-head matchups, and weekly previews.',
    tag: '01',
  },
  {
    to: '/podcast' as const,
    label: 'ManeyCast',
    desc: 'The official league podcast. New episodes, straight from the Drive.',
    tag: '02',
  },
  {
    to: '/history' as const,
    label: 'League History',
    desc: 'Past champions, every trade ever recorded, and full team histories.',
    tag: '03',
  },
  {
    to: '/awards' as const,
    label: 'Awards',
    desc: 'Glory and infamy. Sharpest GM to the Wooden Spoon.',
    tag: '04',
  },
  {
    to: '/teams' as const,
    label: 'Teams',
    desc: 'Every roster, every manager, every bad decision, catalogued.',
    tag: '05',
  },
]

function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-field-line">
        <div
          className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-mustard) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-rust) 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-mustard-bright">
            Est. 2018 · Ten Managers · Zero Self-Awareness
          </p>
          <h1 className="mt-4 font-display text-6xl leading-[0.9] tracking-wide text-parchment sm:text-8xl">
            LEAGUE
            <br />
            OF <span className="text-rust-bright">BUMS</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-parchment-dim">
            The official home of a fantasy football league that takes waiver claims far more
            seriously than it takes itself. Rankings, matchups, trades, and a podcast nobody asked
            for but everybody listens to.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/season"
              className="rounded bg-mustard px-6 py-3 font-mono text-sm uppercase tracking-wide text-field transition hover:bg-mustard-bright"
            >
              View 2026 Season
            </Link>
            <Link
              to="/podcast"
              className="rounded border border-field-line px-6 py-3 font-mono text-sm uppercase tracking-wide text-parchment transition hover:border-rust hover:text-rust-bright"
            >
              Listen to ManeyCast
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-px overflow-hidden rounded-lg border border-field-line bg-field-line sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex flex-col justify-between gap-6 bg-field p-8 transition hover:bg-field-raised"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-parchment-dim">{s.tag}</span>
                <span className="font-display text-2xl text-mustard-bright opacity-0 transition group-hover:opacity-100">
                  →
                </span>
              </div>
              <div>
                <h2 className="font-display text-2xl tracking-wide text-parchment">{s.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-parchment-dim">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
