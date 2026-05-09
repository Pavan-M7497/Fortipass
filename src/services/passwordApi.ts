/**
 * Optional server-side password intelligence (Flask) — used by Checker & Generator.
 */
import { apiJson } from './api'

export interface RemoteAnalyzeResult {
  entropy: number
  strength: number
  label: string
  crackTime: string
  suggestions: string[]
  isWeak: boolean
  compromised: boolean
  breachCount: number
  repeatedPatternPenalty?: number
}

export async function analyzePasswordRemote(password: string): Promise<RemoteAnalyzeResult> {
  return apiJson<RemoteAnalyzeResult>('/api/password/analyze', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export async function generatePasswordRemote(body: {
  length: number
  include_lower: boolean
  include_upper: boolean
  include_numbers: boolean
  include_symbols: boolean
}) {
  return apiJson<{ password: string; analysis: RemoteAnalyzeResult }>('/api/password/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function checkBreachRemote(password: string) {
  return apiJson<{ compromised: boolean; count: number; warning: string | null }>('/api/breach/check', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export async function fetchDashboardStatsRemote() {
  return apiJson<{
    total: number
    weak: number
    strong: number
    reused: number
    securityScore: number
  }>('/api/dashboard/stats', { method: 'GET' })
}
