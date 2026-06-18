import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, cleanup } from '@testing-library/react'
import Navbar from './Navbar'
import { renderWithProviders } from '../test-utils'

afterEach(() => {
  cleanup()
})

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...mod,
    useNavigate: () => navigateMock,
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
      <a href={to} className={className}>{children}</a>
    ),
  }
})

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('Navbar', () => {
  it('affiche le lien vers la page d\'accueil', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByText('Mon App')).toBeInTheDocument()
  })

  it('affiche le lien vers la liste des utilisateurs', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByText('Liste des utilisateurs')).toBeInTheDocument()
  })

  it('affiche le lien de connexion quand non authentifié', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByText('Connexion')).toBeInTheDocument()
    expect(screen.queryByText('Déconnexion')).not.toBeInTheDocument()
  })

  it('affiche le bouton déconnexion quand authentifié et cache Connexion', () => {
    renderWithProviders(<Navbar />, { isAuthenticated: true })
    expect(screen.getByText('Déconnexion')).toBeInTheDocument()
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument()
  })

  it('appelle logout et navigue vers /login au clic sur Déconnexion', () => {
    renderWithProviders(<Navbar />, { isAuthenticated: true })

    fireEvent.click(screen.getByText('Déconnexion'))

    expect(navigateMock).toHaveBeenCalledWith({ to: '/login' })
  })
})
