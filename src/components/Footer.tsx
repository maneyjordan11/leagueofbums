export function Footer() {
  return (
    <footer className="mt-24 border-t border-field-line bg-field-raised/40">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-parchment-dim">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg tracking-wide text-parchment">
            League <span className="text-mustard-bright">of Bums</span>
          </p>
          <p className="font-mono text-xs uppercase tracking-widest">
            Est. 2018 · Fantasy Football, Barely Managed
          </p>
        </div>
      </div>
    </footer>
  )
}
