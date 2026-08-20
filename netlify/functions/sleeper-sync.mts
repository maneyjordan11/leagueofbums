import type { Config } from '@netlify/functions'
import { runSleeperSync } from '../../src/lib/sleeperSync'

export default async () => {
  const result = await runSleeperSync()
  console.log(`[sleeper-sync] ${result.success ? 'ok' : 'error'}: ${result.message}`)
}

export const config: Config = {
  schedule: '*/20 * * * *',
}
