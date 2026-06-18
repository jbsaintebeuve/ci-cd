import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { AuthProvider } from './contexts/AuthContext'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  isAuthenticated?: boolean
  login?: () => void
  logout?: () => void
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderWithProvidersOptions,
) {
  const queryClient = createTestQueryClient()
  const {
    isAuthenticated = false,
    login = () => {},
    logout = () => {},
    ...renderOptions
  } = options ?? {}

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        isAuthenticated={isAuthenticated}
        login={login}
        logout={logout}
      >
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )

  return {
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
    queryClient,
  }
}
