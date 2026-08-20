import type { ReactNode } from 'react'

export function AdminSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl tracking-wide text-parchment">{title}</h2>
      <div className="mt-5 flex flex-col gap-6">{children}</div>
    </section>
  )
}

export function AdminForm({
  onSubmit,
  children,
}: {
  onSubmit: (formData: FormData) => Promise<void>
  children: ReactNode
}) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget
        await onSubmit(new FormData(form))
        form.reset()
      }}
      className="grid gap-3 rounded-lg border border-field-line bg-field-raised/40 p-5 sm:grid-cols-2"
    >
      {children}
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded bg-mustard px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-field hover:bg-mustard-bright"
        >
          Add
        </button>
      </div>
    </form>
  )
}

export function Field({
  name,
  label,
  type = 'text',
  required,
  placeholder,
  full,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  full?: boolean
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${full ? 'sm:col-span-2' : ''}`}>
      <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded border border-field-line bg-field px-3 py-2 text-parchment outline-none focus:border-mustard"
      />
    </label>
  )
}

export function TextAreaField({ name, label, full }: { name: string; label: string; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${full ? 'sm:col-span-2' : ''}`}>
      <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">{label}</span>
      <textarea
        name={name}
        rows={3}
        className="rounded border border-field-line bg-field px-3 py-2 text-parchment outline-none focus:border-mustard"
      />
    </label>
  )
}

export function SelectField({
  name,
  label,
  options,
  full,
}: {
  name: string
  label: string
  options: { value: string; label: string }[]
  full?: boolean
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${full ? 'sm:col-span-2' : ''}`}>
      <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">{label}</span>
      <select
        name={name}
        className="rounded border border-field-line bg-field px-3 py-2 text-parchment outline-none focus:border-mustard"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function ListRow({ children, onDelete }: { children: ReactNode; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded border border-field-line bg-field-raised/30 px-4 py-3">
      <div className="min-w-0 text-sm text-parchment-dim">{children}</div>
      <button
        onClick={onDelete}
        className="shrink-0 rounded border border-field-line px-3 py-1 font-mono text-xs uppercase tracking-widest text-parchment-dim hover:border-rust hover:text-rust-bright"
      >
        Delete
      </button>
    </div>
  )
}
