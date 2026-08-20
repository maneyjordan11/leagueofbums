import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index'
import { teams } from '../../db/schema'
import { requireAdminMiddleware } from '../lib/auth'

const TeamSchema = z.object({
  slug: z.string().min(1),
  teamName: z.string().min(1),
  managerName: z.string().min(1),
  logoUrl: z.string().optional(),
  motto: z.string().optional(),
  teamBio: z.string().optional(),
  managerBio: z.string().optional(),
  founded: z.number().int().optional(),
})

export const getTeams = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(teams).orderBy(teams.teamName)
})

export const getTeamBySlug = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const result = await db.select().from(teams).where(eq(teams.slug, data.slug))
    return result[0] ?? null
  })

export const createTeam = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(TeamSchema)
  .handler(async ({ data }) => {
    const [team] = await db.insert(teams).values(data).returning()
    return team
  })

export const updateTeam = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(TeamSchema.extend({ id: z.number() }))
  .handler(async ({ data }) => {
    const { id, ...values } = data
    const [team] = await db.update(teams).set(values).where(eq(teams.id, id)).returning()
    return team
  })

export const deleteTeam = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(teams).where(eq(teams.id, data.id))
    return { success: true }
  })
