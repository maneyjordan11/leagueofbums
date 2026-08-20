import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '../../db/index'
import { awards, teams } from '../../db/schema'
import { requireAdminMiddleware } from '../lib/auth'

const AwardSchema = z.object({
  season: z.number().int(),
  title: z.string().min(1),
  teamId: z.number().int().optional(),
  description: z.string().optional(),
})

export const getAwards = createServerFn({ method: 'GET' }).handler(async () => {
  const rows = await db.select().from(awards).orderBy(desc(awards.season))
  const allTeams = await db.select().from(teams)
  const teamMap = new Map(allTeams.map((t) => [t.id, t]))
  return rows.map((a) => ({ ...a, team: a.teamId ? teamMap.get(a.teamId) ?? null : null }))
})

export const createAward = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(AwardSchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(awards).values(data).returning()
    return row
  })

export const deleteAward = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(awards).where(eq(awards.id, data.id))
    return { success: true }
  })
