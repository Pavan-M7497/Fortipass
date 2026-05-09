import { apiJson } from './api'
import type { VaultItem } from '../types'

/**
 * Load all vault entries for the logged-in user (server decrypts with app encryption key).
 */
export async function fetchVaultItems(): Promise<VaultItem[]> {
  const data = await apiJson<{ items: VaultItem[] }>('/api/vault/items', { method: 'GET' })
  return data.items
}

/**
 * Polls the vault periodically so the UI stays fresh without Firestore-style websockets.
 */
export function subscribeVault(_userId: string, callback: (items: VaultItem[]) => void) {
  let cancelled = false
  const tick = async () => {
    try {
      const items = await fetchVaultItems()
      if (!cancelled) callback(items)
    } catch {
      if (!cancelled) callback([])
    }
  }
  void tick()
  const id = window.setInterval(tick, 12_000)
  return () => {
    cancelled = true
    window.clearInterval(id)
  }
}

export async function createVaultItem(
  _userId: string,
  item: Omit<VaultItem, 'id' | 'owner' | 'createdAt' | 'updatedAt'>,
) {
  await apiJson('/api/vault/items', {
    method: 'POST',
    body: JSON.stringify({
      website: item.website,
      username: item.username,
      password: item.password,
      notes: item.notes,
      compromised: item.compromised,
      strength: item.strength,
    }),
  })
}

export async function updateVaultItem(
  _userId: string,
  itemId: string,
  item: Omit<VaultItem, 'id' | 'owner' | 'createdAt' | 'updatedAt'>,
) {
  await apiJson(`/api/vault/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({
      website: item.website,
      username: item.username,
      password: item.password,
      notes: item.notes,
      compromised: item.compromised,
      strength: item.strength,
    }),
  })
}

export async function deleteVaultItem(itemId: string) {
  await apiJson(`/api/vault/items/${itemId}`, { method: 'DELETE' })
}
