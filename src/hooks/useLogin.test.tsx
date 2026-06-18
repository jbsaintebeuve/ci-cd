import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLoginMutation } from './useLogin'
import type { ReactNode } from 'react'

const loginMock = vi.fn()

vi.mock('../services/apiService', () => ({
  login: (payload: unknown) => loginMock(payload),
}))

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('useLoginMutation', () => {
  it("expose mutate et isPending", () => {
    const { result } = renderHook(() => useLoginMutation(), { wrapper })
    expect(typeof result.current.mutate).toBe('function')
    expect(result.current.isPending).toBe(false)
  })

  it("appelle login avec le payload fourni", async () => {
    loginMock.mockResolvedValueOnce(true)

    const { result } = renderHook(() => useLoginMutation(), { wrapper })

    await waitFor(() => {
      result.current.mutate({ email: 'a@b.com', password: 'secret' })
    })

    expect(loginMock).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'secret',
    })
  })

  it("appelle onError quand login échoue", async () => {
    loginMock.mockRejectedValueOnce(new Error('Connexion impossible'))

    const onError = vi.fn()

    const { result } = renderHook(() => useLoginMutation(), { wrapper })

    await waitFor(() => {
      result.current.mutate(
        { email: 'err@b.com', password: 'wrong' },
        { onError },
      )
    })

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })

  it("appelle onSuccess avec false quand les identifiants sont invalides", async () => {
    loginMock.mockResolvedValueOnce(false)

    const onSuccess = vi.fn()

    const { result } = renderHook(() => useLoginMutation(), { wrapper })

    await waitFor(() => {
      result.current.mutate(
        { email: 'bad@c.com', password: 'bad' },
        { onSuccess },
      )
    })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
      expect(onSuccess.mock.calls[0][0]).toBe(false)
    })
  })
})
