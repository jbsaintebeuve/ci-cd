import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, cleanup, waitFor } from '@testing-library/react'
import UsersPage from './users'
import { renderWithProviders } from '../test-utils'

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
})

function mockFetchUsers(users: unknown[]) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ utilisateurs: users }),
  } as Response)
}

function mockFetchError() {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: false,
  } as Response)
}

const rawUser = {
  id: 1,
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean@example.com',
  date_naissance: '1990-06-15',
  ville: 'Paris',
  code_postal: '75001',
}

describe('UsersPage', () => {
  it('affiche le titre Inscrits via UserList', async () => {
    mockFetchUsers([])
    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText(/inscrits/i)).toBeInTheDocument()
    })
  })

  it("affiche le message quand la liste est vide", async () => {
    mockFetchUsers([])
    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText(/aucun inscrit/i)).toBeInTheDocument()
    })
  })

  it("affiche les utilisateurs quand la liste est peuplée", async () => {
    mockFetchUsers([rawUser])
    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText(/inscrits \(1\)/i)).toBeInTheDocument()
    })
  })

  it("affiche le nom complet quand l'utilisateur est connecté", async () => {
    mockFetchUsers([rawUser])
    renderWithProviders(<UsersPage />, { isAuthenticated: true })

    await waitFor(() => {
      expect(screen.getByText(/jean dupont/i)).toBeInTheDocument()
      expect(screen.getByText(/jean@example\.com/i)).toBeInTheDocument()
    })
  })

  it('affiche un message d\'erreur si la requête échoue', async () => {
    mockFetchError()
    renderWithProviders(<UsersPage />)

    await waitFor(() => {
      expect(
        screen.getByText(/erreur lors du chargement des utilisateurs/i),
      ).toBeInTheDocument()
    })
  })
})
