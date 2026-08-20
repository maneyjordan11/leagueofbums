import { createServerFn, createMiddleware } from '@tanstack/react-start'
import { z } from 'zod'
import { getAdminSession, isAdminAuthenticated, loginAdmin, logoutAdmin } from './session'

export const getIsAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  return isAdminAuthenticated()
})

export const adminLogin = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const ok = await loginAdmin(data.password)
    if (!ok) {
      return { success: false as const, error: 'Incorrect password.' }
    }
    return { success: true as const }
  })

export const adminLogout = createServerFn({ method: 'POST' }).handler(async () => {
  await logoutAdmin()
  return { success: true as const }
})

export const requireAdminMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getAdminSession()
  if (session.data.isAdmin !== true) {
    throw new Error('Admin authentication required')
  }
  return next()
})
