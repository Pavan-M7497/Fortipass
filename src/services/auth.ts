import { apiJson } from './api'
import type { AuthUser } from '../types'

const TOKEN_KEY = 'fortipass_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function registerUser(email: string, password: string, displayName: string): Promise<AuthUser> {
  const data = await apiJson<{ access_token: string; user: AuthUser }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, display_name: displayName }),
  })
  setStoredToken(data.access_token)
  return data.user
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const data = await apiJson<{ access_token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setStoredToken(data.access_token)
  return data.user
}

export function logoutUser(): void {
  setStoredToken(null)
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  if (!getStoredToken()) return null
  try {
    const data = await apiJson<{ user: AuthUser }>('/api/auth/me', { method: 'GET' })
    return data.user
  } catch {
    setStoredToken(null)
    return null
  }
}
