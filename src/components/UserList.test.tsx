import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, cleanup, waitFor, fireEvent } from '@testing-library/react'
import UserList from './UserList'
import { renderWithProviders } from '../test-utils'

const rawUsers = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'marie@example.com',
    date_naissance: '2000-01-15',
    ville: 'Lyon',
    code_postal: '69000',
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Jean',
    email: 'jean@example.com',
    date_naissance: '1995-06-20',
    ville: 'Paris',
    code_postal: '75001',
  },
  {
    id: 3,
    nom: 'A',
    prenom: 'B',
    email: 'a@b.c',
    date_naissance: '2000-01-01',
    ville: 'X',
    code_postal: '00000',
  },
]

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
})

function mockFetchUsers(users: typeof rawUsers) {
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

describe('UserList', () => {
  it('affiche un message de chargement', () => {
    mockFetchUsers([])
    renderWithProviders(<UserList />)
    expect(screen.getByText(/chargement/i)).toBeInTheDocument()
  })

  it('affiche un message quand la liste est vide', async () => {
    mockFetchUsers([])
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/aucun inscrit/i)).toBeInTheDocument()
    })
  })

  it('affiche les utilisateurs avec nom censuré quand non connecté', async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/marie d\./i)).toBeInTheDocument()
    })
  })

  it("affiche l'email censuré quand non connecté", async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/m\*\*\*\*e@example\.com/i)).toBeInTheDocument()
    })
  })

  it("affiche le nombre d'inscrits", async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(
        screen.getAllByText(/inscrits \(1\)/i).length
      ).toBeGreaterThan(0)
    })
  })

  it("démonte sans erreur", () => {
    mockFetchUsers([])
    const { unmount } = renderWithProviders(<UserList />)
    expect(() => unmount()).not.toThrow()
  })

  it('affiche les informations de plusieurs utilisateurs (censuré)', async () => {
    mockFetchUsers(rawUsers.slice(0, 2))
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/marie d\./i)).toBeInTheDocument()
    })
    expect(screen.getByText(/jean m\./i)).toBeInTheDocument()
    expect(screen.getByText(/inscrits \(2\)/i)).toBeInTheDocument()
  })

  it("affiche les données complètes quand connecté", async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByText(/marie dupont/i)).toBeInTheDocument()
      expect(screen.getByText(/marie@example\.com/i)).toBeInTheDocument()
    })
  })

  it('affiche le bouton Gérer quand connecté', async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /gérer/i })).toBeInTheDocument()
    })
  })

  it("n'affiche pas le bouton Gérer quand non connecté", async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/marie d\./i)).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /gérer/i })).not.toBeInTheDocument()
  })

  it("affiche un message d'erreur si la requête échoue", async () => {
    mockFetchError()
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/erreur lors du chargement/i)).toBeInTheDocument()
    })
  })

  it("ouvre le dialogue de gestion au clic sur Gérer", async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /gérer/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /gérer/i }))

    expect(screen.getByText(/Détails de Marie Dupont/)).toBeInTheDocument()
  })

  it("ferme le dialogue de gestion via onOpenChange", async () => {
    mockFetchUsers([rawUsers[0]])
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /gérer/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /gérer/i }))
    expect(screen.getByText(/Détails de Marie Dupont/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Éditer'))
    fireEvent.click(screen.getByText('Sauvegarder'))

    await waitFor(() => {
      expect(screen.queryByText(/Détails de Marie Dupont/)).not.toBeInTheDocument()
    })
  })

  it("n'applique pas la censure email si l'arobase est en position 0 ou 1", async () => {
    mockFetchUsers([rawUsers[2]])
    renderWithProviders(<UserList />)
    await waitFor(() => {
      expect(screen.getByText(/a@b\.c/)).toBeInTheDocument()
    })
  })
})
