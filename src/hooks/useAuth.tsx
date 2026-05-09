import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { fetchCurrentUser, getStoredToken } from '../services/auth'
import { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  /** Call after login/signup/logout to sync React state with JWT / localStorage */
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null)
      return
    }
    const u = await fetchCurrentUser()
    setUser(u)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const u = await fetchCurrentUser()
      if (!cancelled) {
        setUser(u)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => ({ user, loading, refreshUser }), [user, loading, refreshUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
