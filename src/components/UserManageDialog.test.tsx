import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react'
import UserManageDialog from './UserManageDialog'
import type { User } from '../services/apiService'
import { renderWithProviders } from '../test-utils'

afterEach(() => {
  cleanup()
})

const sonnerMocks = vi.hoisted(() => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

const deleteUserMock = vi.fn()
const updateUserMock = vi.fn()

vi.mock("sonner", () => sonnerMocks)

vi.mock('../services/apiService', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../services/apiService')>()
  return {
    ...mod,
    deleteUser: (...args: unknown[]) => deleteUserMock(...args),
    updateUser: (...args: unknown[]) => updateUserMock(...args),
  }
})

const user: User = {
  id: 1,
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@example.com',
  birthDate: '1990-05-20',
  city: 'Paris',
  postalCode: '75001',
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('UserManageDialog', () => {
  it("n'affiche rien si user est null", () => {
    const { container } = renderWithProviders(
      <UserManageDialog user={null} open={true} onOpenChange={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it("affiche les détails de l'utilisateur", () => {
    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )
    expect(screen.getByText('Jean')).toBeInTheDocument()
    expect(screen.getByText('Dupont')).toBeInTheDocument()
    expect(screen.getByText('jean@example.com')).toBeInTheDocument()
    expect(screen.getByText('1990-05-20')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
    expect(screen.getByText('75001')).toBeInTheDocument()
  })

  it("affiche le titre du dialogue avec le nom complet", () => {
    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )
    expect(screen.getByText(/Détails de Jean Dupont/)).toBeInTheDocument()
  })

  it('affiche les boutons Éditer et Supprimer en mode lecture', () => {
    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )
    expect(screen.getByText('Éditer')).toBeInTheDocument()
    expect(screen.getByText('Supprimer')).toBeInTheDocument()
  })

  it('passe en mode édition au clic sur Éditer', () => {
    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Éditer'))

    expect(screen.getByText('Annuler')).toBeInTheDocument()
    expect(screen.getByText('Sauvegarder')).toBeInTheDocument()
    expect(screen.queryByText('Éditer')).not.toBeInTheDocument()
    expect(screen.queryByText('Supprimer')).not.toBeInTheDocument()
  })

  it('annule le mode édition au clic sur Annuler', () => {
    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Éditer'))
    fireEvent.click(screen.getByText('Annuler'))

    expect(screen.getByText('Éditer')).toBeInTheDocument()
    expect(screen.getByText('Supprimer')).toBeInTheDocument()
  })

  it('appelle updateUser avec les données modifiées au clic sur Sauvegarder', async () => {
    updateUserMock.mockResolvedValueOnce(undefined)

    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Éditer'))

    const firstNameInput = screen.getByDisplayValue('Jean')
    fireEvent.change(firstNameInput, { target: { value: 'Pierre' } })

    await act(async () => {
      fireEvent.click(screen.getByText('Sauvegarder'))
    })

    await waitFor(() => {
      expect(updateUserMock).toHaveBeenCalledWith(1, expect.objectContaining({ firstName: 'Pierre' }))
    })
  })

  it("appelle le toast success après une mise à jour réussie", async () => {
    updateUserMock.mockResolvedValueOnce(undefined)

    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Éditer'))

    await act(async () => {
      fireEvent.click(screen.getByText('Sauvegarder'))
    })

    await waitFor(() => {
      expect(sonnerMocks.toast.success).toHaveBeenCalledWith('Utilisateur mis à jour')
    })
  })

  it('appelle deleteUser après confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true)
    deleteUserMock.mockResolvedValueOnce(undefined)

    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Supprimer'))
    })

    expect(window.confirm).toHaveBeenCalledWith('Supprimer Jean Dupont ?')
    await waitFor(() => {
      expect(deleteUserMock).toHaveBeenCalledWith(1)
    })
  })

  it("ne supprime pas si l'utilisateur annule la confirmation", () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false)

    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Supprimer'))

    expect(deleteUserMock).not.toHaveBeenCalled()
  })

  it('pré-remplit les champs du formulaire en mode édition', () => {
    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Éditer'))

    expect(screen.getByDisplayValue('Jean')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Dupont')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jean@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1990-05-20')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument()
    expect(screen.getByDisplayValue('75001')).toBeInTheDocument()
  })

  it("affiche un toast d'erreur si la mise à jour échoue", async () => {
    updateUserMock.mockRejectedValueOnce(new Error('fail'))

    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Éditer'))

    await act(async () => {
      fireEvent.click(screen.getByText('Sauvegarder'))
    })

    await waitFor(() => {
      expect(sonnerMocks.toast.error).toHaveBeenCalledWith('Erreur lors de la mise à jour')
    })
  })

  it("affiche un toast d'erreur si la suppression échoue", async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true)
    deleteUserMock.mockRejectedValueOnce(new Error('fail'))

    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Supprimer'))
    })

    await waitFor(() => {
      expect(sonnerMocks.toast.error).toHaveBeenCalledWith('Erreur lors de la suppression')
    })
  })

  it("permet de modifier tous les champs en mode édition", () => {
    renderWithProviders(
      <UserManageDialog user={user} open={true} onOpenChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByText('Éditer'))

    fireEvent.change(screen.getByDisplayValue('Jean'), {
      target: { value: 'Pierre' },
    })
    fireEvent.change(screen.getByDisplayValue('Dupont'), {
      target: { value: 'Durand' },
    })
    fireEvent.change(screen.getByDisplayValue('jean@example.com'), {
      target: { value: 'pierre@test.fr' },
    })
    fireEvent.change(screen.getByDisplayValue('1990-05-20'), {
      target: { value: '1992-08-15' },
    })
    fireEvent.change(screen.getByDisplayValue('Paris'), {
      target: { value: 'Marseille' },
    })
    fireEvent.change(screen.getByDisplayValue('75001'), {
      target: { value: '13001' },
    })

    expect(screen.getByDisplayValue('Pierre')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Durand')).toBeInTheDocument()
    expect(screen.getByDisplayValue('pierre@test.fr')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1992-08-15')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Marseille')).toBeInTheDocument()
    expect(screen.getByDisplayValue('13001')).toBeInTheDocument()
  })
})
