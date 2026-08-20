import { Link } from '@tanstack/react-router'
import { useState } from 'react'

const LINKS = [
  { to: '/season', label: '2026 Season' },
  { to: '/podcast', label: 'ManeyCast' },
  { to: '/history', label: 'History' },
  { to: '/awards', label: 'Awards' },
  { to: '/teams', label: 'Teams' },
] as const

export function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-field-line)] bg-[var(--color-field)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-mustard bg-field-raised font-display text-lg text-mustard-bright transition group-hover:rotate-6">
            LOB
          </span>
          <span className="font-display text-2xl leading-none tracking-wide text-parchment">
            League <span className="text-mustard-bright">of Bums</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded px-3 py-2 font-mono text-sm uppercase tracking-wide text-parchment-dim transition hover:bg-field-raised hover:text-mustard-bright"
              activeProps={{ className: 'rounded px-3 py-2 font-mono text-sm uppercase tracking-wide text-mustard-bright bg-field-raised' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="ml-2 rounded border border-[var(--color-field-line)] px-3 py-2 font-mono text-xs uppercase tracking-wide text-parchment-dim transition hover:border-rust hover:text-rust-bright"
          >
            Admin
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded border border-[var(--color-field-line)] text-parchment md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="font-display text-xl">{open ? '×' : '≡'}</span>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--color-field-line)] px-5 py-4 md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded px-3 py-2 font-mono text-sm uppercase tracking-wide text-parchment-dim hover:bg-field-raised hover:text-mustard-bright"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="rounded px-3 py-2 font-mono text-sm uppercase tracking-wide text-parchment-dim hover:text-rust-bright"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  )
}
