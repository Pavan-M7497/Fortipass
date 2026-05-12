import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  /** Call after login/signup/logout to sync React state with Firebase auth */
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refreshUser: async () => {},
})

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    setUser(mapUser(auth.currentUser))
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapUser(firebaseUser))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = useMemo(() => ({ user, loading, refreshUser }), [user, loading, refreshUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
