import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import type { VaultItem } from '../types'

function normalizeTimestamp(value: unknown): string | null {
  if (!value) return null
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (typeof value === 'string') return value
  return null
}

function mapDoc(id: string, owner: string, data: DocumentData): VaultItem {
  return {
    id,
    owner,
    website: data.website || '',
    username: data.username || '',
    password: data.password || '',
    notes: data.notes || '',
    compromised: data.compromised ?? false,
    strength: typeof data.strength === 'number' ? data.strength : 0,
    createdAt: normalizeTimestamp(data.createdAt),
    updatedAt: normalizeTimestamp(data.updatedAt),
  }
}

const vaultCollection = (userId: string) => collection(db, 'users', userId, 'vault')

export async function fetchVaultItems(userId: string): Promise<VaultItem[]> {
  const vaultQuery = query(vaultCollection(userId), orderBy('updatedAt', 'desc'))
  const snapshot = await getDocs(vaultQuery)
  return snapshot.docs.map((docSnapshot) => mapDoc(docSnapshot.id, userId, docSnapshot.data()))
}

export function subscribeVault(userId: string, callback: (items: VaultItem[]) => void) {
  const vaultQuery = query(vaultCollection(userId), orderBy('updatedAt', 'desc'))
  const unsubscribe = onSnapshot(
    vaultQuery,
    (snapshot) => {
      callback(snapshot.docs.map((docSnapshot) => mapDoc(docSnapshot.id, userId, docSnapshot.data())))
    },
    () => {
      callback([])
    },
  )
  return unsubscribe
}

export async function createVaultItem(
  userId: string,
  item: Omit<VaultItem, 'id' | 'owner' | 'createdAt' | 'updatedAt'>,
) {
  await addDoc(vaultCollection(userId), {
    owner: userId,
    website: item.website,
    username: item.username,
    password: item.password,
    notes: item.notes,
    compromised: item.compromised,
    strength: item.strength,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateVaultItem(
  userId: string,
  itemId: string,
  item: Omit<VaultItem, 'id' | 'owner' | 'createdAt' | 'updatedAt'>,
) {
  const itemRef = doc(db, 'users', userId, 'vault', itemId)
  await updateDoc(itemRef, {
    website: item.website,
    username: item.username,
    password: item.password,
    notes: item.notes,
    compromised: item.compromised,
    strength: item.strength,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteVaultItem(userId: string, itemId: string) {
  const itemRef = doc(db, 'users', userId, 'vault', itemId)
  await deleteDoc(itemRef)
}
