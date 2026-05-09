/**
 * FortiPass HTTP client — attaches JWT from localStorage and targets Flask API.
 * When VITE_API_URL is unset, requests use same-origin `/api/...` (Vite dev proxy → Flask).
 */
const RAW = import.meta.env.VITE_API_URL as string | undefined
export const API_BASE = RAW != null && RAW !== '' ? RAW.replace(/\/$/, '') : ''

export function getAuthHeaders(): Record<string, string> {
  const t = localStorage.getItem('fortipass_token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
    ...getAuthHeaders(),
  }
  const res = await fetch(url, { ...init, headers })
  const text = await res.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    /* non-JSON body */
  }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error || res.statusText || 'Request failed'
    throw new Error(msg)
  }
  return data as T
}
