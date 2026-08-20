export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="relative overflow-hidden border-b border-field-line bg-field-raised/60">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-rust) 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-mustard-bright">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-wide text-parchment sm:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-parchment-dim">{description}</p>
        )}
      </div>
    </div>
  )
}
