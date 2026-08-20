import { useServerFn } from '@tanstack/react-start'
import { createTrade, deleteTrade } from '@/server/history.functions'
import { AdminSection, AdminForm, Field, TextAreaField, ListRow } from './shared'

type Team = { id: number; teamName: string }
type Trade = { id: number; tradeDate: string; summary: string; teams: (Team | undefined)[] }

export function TradesManager({
  trades,
  teams,
  onChange,
}: {
  trades: Trade[]
  teams: Team[]
  onChange: () => void
}) {
  const create = useServerFn(createTrade)
  const remove = useServerFn(deleteTrade)

  return (
    <AdminSection title="Trades">
      <AdminForm
        onSubmit={async (fd) => {
          const teamIds = fd
            .getAll('teamIds')
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n))
          await create({
            data: {
              tradeDate: String(fd.get('tradeDate')),
              season: fd.get('season') ? Number(fd.get('season')) : undefined,
              summary: String(fd.get('summary')),
              details: String(fd.get('details') || ''),
              teamIds,
            },
          })
          onChange()
        }}
      >
        <Field name="tradeDate" label="Trade Date" required placeholder="2026-09-01" />
        <Field name="season" label="Season" type="number" />
        <Field name="summary" label="Summary" required full />
        <TextAreaField name="details" label="Details" full />
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-widest text-parchment-dim">
            Teams Involved (ctrl/cmd-click to select multiple)
          </span>
          <select
            name="teamIds"
            multiple
            className="rounded border border-field-line bg-field px-3 py-2 text-parchment outline-none focus:border-mustard"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.teamName}
              </option>
            ))}
          </select>
        </label>
      </AdminForm>

      <div className="flex flex-col gap-2">
        {trades.map((t) => (
          <ListRow
            key={t.id}
            onDelete={async () => {
              await remove({ data: { id: t.id } })
              onChange()
            }}
          >
            {t.tradeDate} — <span className="font-semibold text-parchment">{t.summary}</span>{' '}
            <span className="font-mono text-xs">
              ({t.teams.filter(Boolean).map((tm) => tm!.teamName).join(' / ')})
            </span>
          </ListRow>
        ))}
      </div>
    </AdminSection>
  )
}
