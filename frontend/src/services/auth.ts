import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, type User } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import type { AuthUser } from '../types'

function mapUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }
}

export async function registerUser(email: string, password: string, displayName: string): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  if (credential.user && displayName) {
    await updateProfile(credential.user, { displayName })
  }
  return mapUser(credential.user)
}

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return mapUser(credential.user)
}

export async function logoutUser(): Promise<void> {
  await signOut(auth)
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const user = auth.currentUser
  return user ? mapUser(user) : null
}
