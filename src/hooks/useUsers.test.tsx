import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useUsersQuery,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from './useUsers'
import type { ReactNode } from 'react'
import type { User } from '../services/apiService'

const fetchUsersMock = vi.fn()
const createUserMock = vi.fn()
const deleteUserMock = vi.fn()
const updateUserMock = vi.fn()

let invalidateQueriesSpy = vi.fn()

vi.mock('../services/apiService', () => ({
  fetchUsers: () => fetchUsersMock(),
  createUser: (p: unknown) => createUserMock(p),
  deleteUser: (id: unknown) => deleteUserMock(id),
  updateUser: (id: unknown, p: unknown) => updateUserMock(id, p),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...mod,
    useQueryClient: () => ({
      invalidateQueries: invalidateQueriesSpy,
    }) as unknown as QueryClient,
  }
})

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

beforeEach(() => {
  vi.restoreAllMocks()
  invalidateQueriesSpy = vi.fn()
})

describe('useUsersQuery', () => {
  it('appelle fetchUsers et expose les données', async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        lastName: 'Dupont',
        firstName: 'Marie',
        email: 'marie@example.com',
        birthDate: '2000-01-15',
        city: 'Lyon',
        postalCode: '69000',
      },
    ]
    fetchUsersMock.mockResolvedValueOnce(mockUsers)

    const { result } = renderHook(() => useUsersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUsers)
    })
    expect(fetchUsersMock).toHaveBeenCalled()
  })

  it("expose isError quand fetchUsers échoue", async () => {
    fetchUsersMock.mockRejectedValueOnce(new Error('Erreur réseau'))

    const { result } = renderHook(() => useUsersQuery(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toEqual(new Error('Erreur réseau'))
  })
})

describe('useCreateUser', () => {
  it('appelle createUser et invalide le cache', async () => {
    createUserMock.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useCreateUser(), { wrapper })

    const payload = {
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: '2000-01-15',
      city: 'Lyon',
      postalCode: '69000',
    }

    await waitFor(() => {
      result.current.mutate(payload)
    })

    await waitFor(() => {
      expect(createUserMock).toHaveBeenCalledWith(payload)
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['users'] }),
      )
    })
  })

  it("ne fait pas d'invalidation quand createUser échoue", async () => {
    createUserMock.mockRejectedValueOnce(new Error('Création impossible'))

    const { result } = renderHook(() => useCreateUser(), { wrapper })

    const payload = {
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: '2000-01-15',
      city: 'Lyon',
      postalCode: '69000',
    }

    await waitFor(() => {
      result.current.mutate(payload)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(invalidateQueriesSpy).not.toHaveBeenCalled()
  })
})

describe('useDeleteUser', () => {
  it('appelle deleteUser avec le bon id et invalide le cache', async () => {
    deleteUserMock.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useDeleteUser(), { wrapper })

    await waitFor(() => {
      result.current.mutate(42)
    })

    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith(42)
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['users'] }),
      )
    })
  })

  it("ne fait pas d'invalidation quand deleteUser échoue", async () => {
    deleteUserMock.mockRejectedValueOnce(new Error('Suppression impossible'))

    const { result } = renderHook(() => useDeleteUser(), { wrapper })

    await waitFor(() => {
      result.current.mutate(42)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(invalidateQueriesSpy).not.toHaveBeenCalled()
  })
})

describe('useUpdateUser', () => {
  it('appelle updateUser avec id + payload et invalide le cache', async () => {
    updateUserMock.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useUpdateUser(), { wrapper })

    const payload = {
      lastName: 'Martin',
      firstName: 'Jean',
      email: 'jean@example.com',
      birthDate: '1995-06-20',
      city: 'Paris',
      postalCode: '75001',
    }

    await waitFor(() => {
      result.current.mutate({ id: 7, payload })
    })

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith(7, payload)
      expect(invalidateQueriesSpy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: ['users'] }),
      )
    })
  })

  it("ne fait pas d'invalidation quand updateUser échoue", async () => {
    updateUserMock.mockRejectedValueOnce(new Error('Mise à jour impossible'))

    const { result } = renderHook(() => useUpdateUser(), { wrapper })

    const payload = {
      lastName: 'Martin',
      firstName: 'Jean',
      email: 'jean@example.com',
      birthDate: '1995-06-20',
      city: 'Paris',
      postalCode: '75001',
    }

    await waitFor(() => {
      result.current.mutate({ id: 7, payload })
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(invalidateQueriesSpy).not.toHaveBeenCalled()
  })
})
