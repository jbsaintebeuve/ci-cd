import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { AuthContext as AuthContextType } from '../router'

const AuthReactContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  isAuthenticated,
  login,
  logout,
  children,
}: {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  children: ReactNode
}) {
  const value = useMemo<AuthContextType>(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  )

  return (
    <AuthReactContext.Provider value={value}>
      {children}
    </AuthReactContext.Provider>
  )
}

/**
 * Hook pour accéder au contexte d'authentification.
 * Doit être utilisé à l'intérieur d'un {@link AuthProvider}.
 *
 * @returns L'état d'authentification et les fonctions `login` / `logout`
 * @throws {Error} Si le hook est utilisé en dehors d'un {@link AuthProvider}
 */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthReactContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
