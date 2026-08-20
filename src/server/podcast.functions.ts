import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '../../db/index'
import { podcastEpisodes } from '../../db/schema'
import { requireAdminMiddleware } from '../lib/auth'

const EpisodeSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  driveUrl: z.string().url(),
  episodeNumber: z.number().int().optional(),
})

export const getPodcastEpisodes = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(podcastEpisodes).orderBy(desc(podcastEpisodes.publishedAt))
})

export const createPodcastEpisode = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator(EpisodeSchema)
  .handler(async ({ data }) => {
    const [row] = await db.insert(podcastEpisodes).values(data).returning()
    return row
  })

export const deletePodcastEpisode = createServerFn({ method: 'POST' })
  .middleware([requireAdminMiddleware])
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(podcastEpisodes).where(eq(podcastEpisodes.id, data.id))
    return { success: true }
  })
