import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { adminLogin } from '@/lib/auth'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const login = useServerFn(adminLogin)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError(null)
    const result = await login({ data: { password } })
    setPending(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    navigate({ to: '/admin' })
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-5 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-mustard-bright">Admin Access</p>
      <h1 className="mt-2 font-display text-3xl tracking-wide text-parchment">League Control Room</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="rounded border border-field-line bg-field-raised/50 px-3 py-2 text-parchment outline-none focus:border-mustard"
          />
        </label>

        {error && <p className="text-sm text-rust-bright">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-mustard px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest text-field hover:bg-mustard-bright disabled:opacity-50"
        >
          {pending ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
