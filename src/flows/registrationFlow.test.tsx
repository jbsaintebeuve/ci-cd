import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import RegistrationForm from '../components/RegistrationForm'
import UserList from '../components/UserList'
import { renderWithProviders } from '../test-utils'

const sonnerMocks = vi.hoisted(() => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('sonner', () => sonnerMocks)

const RAW_USERS = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    date_naissance: '1990-06-15',
    ville: 'Paris',
    code_postal: '75001',
  },
]

beforeEach(() => {
  sonnerMocks.toast.error.mockClear()
  sonnerMocks.toast.success.mockClear()
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
})

function fillValidFields() {
  fireEvent.change(screen.getByLabelText(/^nom$/i), {
    target: { value: 'Dupont' },
  })
  fireEvent.change(screen.getByLabelText(/^prénom$/i), {
    target: { value: 'Jean' },
  })
  fireEvent.change(screen.getByLabelText(/^mail$/i), {
    target: { value: 'jean.dupont@example.com' },
  })
  fireEvent.change(screen.getByLabelText(/^ville$/i), {
    target: { value: 'Paris' },
  })
  fireEvent.change(screen.getByLabelText(/^code postal$/i), {
    target: { value: '75001' },
  })
}

function selectBirthDate() {
  fireEvent.click(
    screen.getAllByRole('button', { name: /choisir une date/i })[0],
  )
  const dayButton = screen
    .getAllByRole('button')
    .find((b) => /^\d{1,2}$/.test(b.textContent ?? ''))
  if (dayButton) fireEvent.click(dayButton)
}

describe("Flux d'inscription — cas d'usage", () => {
  it('aucun utilisateur → formulaire → création réussie → liste mise à jour', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2005, 0, 1))

    // GET users (empty) → POST create (ok) → GET users (1 user)
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: RAW_USERS }),
      } as Response)

    // Render UserList — should show "Aucun inscrit"
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByText(/aucun inscrit/i)).toBeInTheDocument()
    })

    cleanup()

    // Now render RegistrationForm and fill/submit
    renderWithProviders(<RegistrationForm />)
    fillValidFields()
    selectBirthDate()

    vi.useRealTimers()

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: 'Dupont ' },
    })

    fireEvent.click(
      screen.getAllByRole('button', { name: /sauvegarder/i })[0],
    )

    await waitFor(() => {
      expect(sonnerMocks.toast.success).toHaveBeenCalledWith('Sauvegardé.')
    })
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/users',
      expect.objectContaining({ method: 'POST' }),
    )

    cleanup()

    // Render UserList again to verify the user appears
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByText(/inscrits \(1\)/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/jean dupont/i)).toBeInTheDocument()
  })

  it('1 utilisateur existant → formulaire → erreur création → liste inchangée', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2005, 0, 1))

    // GET users (1 user) → POST create (error)
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ utilisateurs: RAW_USERS }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
      } as Response)

    // Render UserList — should show 1 user
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByText(/inscrits \(1\)/i)).toBeInTheDocument()
    })

    cleanup()

    // Now render RegistrationForm and fill/submit
    renderWithProviders(<RegistrationForm />)
    fillValidFields()
    selectBirthDate()

    vi.useRealTimers()

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: 'Dupont ' },
    })

    fireEvent.click(
      screen.getAllByRole('button', { name: /sauvegarder/i })[0],
    )

    await waitFor(() => {
      expect(sonnerMocks.toast.error).toHaveBeenCalledWith(
        'Erreur lors de la sauvegarde.',
      )
    })

    cleanup()

    // Render UserList again — still 1 user (no increment)
    renderWithProviders(<UserList />, { isAuthenticated: true })
    await waitFor(() => {
      expect(screen.getByText(/inscrits \(1\)/i)).toBeInTheDocument()
    })
  })

  it("consulter la liste — l'API échoue → message d'erreur affiché", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)

    renderWithProviders(<UserList />)

    await waitFor(() => {
      expect(
        screen.getByText(/erreur lors du chargement des utilisateurs/i),
      ).toBeInTheDocument()
    })
  })
})
