import { getSession, updateSession, clearSession } from '@tanstack/react-start/server'
import type { SessionConfig } from '@tanstack/react-start/server'

const sessionPassword =
  process.env.SESSION_SECRET ?? 'league-of-bums-dev-secret-change-me-in-prod-32c'

export const sessionConfig: SessionConfig = {
  name: 'lob_admin_session',
  password: sessionPassword,
}

export interface AdminSessionData {
  isAdmin?: boolean
}

export async function getAdminSession() {
  return getSession<AdminSessionData>(sessionConfig)
}

export async function isAdminAuthenticated() {
  const session = await getAdminSession()
  return session.data.isAdmin === true
}

export async function loginAdmin(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? 'SnakeCast'
  if (password !== expected) {
    return false
  }
  await updateSession(sessionConfig, { isAdmin: true })
  return true
}

export async function logoutAdmin() {
  await clearSession(sessionConfig)
}
