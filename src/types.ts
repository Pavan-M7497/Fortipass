export interface VaultItem {
  id: string
  owner: string
  website: string
  username: string
  password: string
  notes: string
  compromised: boolean
  strength: number
  /** ISO string from API (legacy Firestore shape no longer used) */
  createdAt: string | null
  updatedAt?: string | null
}

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}
