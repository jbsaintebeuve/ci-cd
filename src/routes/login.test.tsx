import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, cleanup } from '@testing-library/react'
import LoginPage from './login'
import { renderWithProviders } from '../test-utils'

afterEach(() => {
  cleanup()
})

const navigateMock = vi.fn()
const loginMutateMock = vi.fn()
let isPending = false

const sonnerMocks = vi.hoisted(() => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Toaster: vi.fn(() => null),
}))

vi.mock("sonner", () => sonnerMocks)

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...mod,
    useRouter: () => ({ navigate: navigateMock }),
  }
})

vi.mock('../hooks/useLogin', () => ({
  useLoginMutation: () => ({
    mutate: loginMutateMock,
    get isPending() { return isPending },
  }),
}))

beforeEach(() => {
  vi.restoreAllMocks()
  isPending = false
})

describe('LoginPage', () => {
  it('affiche le formulaire de connexion', () => {
    renderWithProviders(<LoginPage />)

    expect(screen.getByText('Connexion')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
  })

  it("affiche la description de connexion admin", () => {
    renderWithProviders(<LoginPage />)
    expect(
      screen.getByText(/Connectez-vous avec votre compte administrateur/i),
    ).toBeInTheDocument()
  })

  it('appelle loginMutation.mutate avec email et mot de passe à la soumission', () => {
    renderWithProviders(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'secret123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(loginMutateMock).toHaveBeenCalledWith(
      { email: 'admin@test.com', password: 'secret123' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    )
  })

  it("appelle login après une connexion réussie", () => {
    const loginFn = vi.fn()

    loginMutateMock.mockImplementationOnce(
      (_vars: unknown, opts: { onSuccess: (success: boolean) => void }) => {
        opts.onSuccess(true)
      },
    )

    renderWithProviders(<LoginPage />, {
      isAuthenticated: false,
      login: loginFn,
    })

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'secret' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(loginFn).toHaveBeenCalled()
  })

  it("affiche une erreur si la connexion échoue (success=false)", () => {
    loginMutateMock.mockImplementationOnce(
      (_vars: unknown, opts: { onSuccess: (success: boolean) => void }) => {
        opts.onSuccess(false)
      },
    )

    renderWithProviders(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'wrong' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(sonnerMocks.toast.error).toHaveBeenCalledWith(
      'Email ou mot de passe incorrect.',
    )
  })

  it('affiche une erreur si la mutation échoue', () => {
    loginMutateMock.mockImplementationOnce(
      (_vars: unknown, opts: { onError: () => void }) => {
        opts.onError()
      },
    )

    renderWithProviders(<LoginPage />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'err@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Mot de passe'), {
      target: { value: 'err' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(sonnerMocks.toast.error).toHaveBeenCalledWith('Erreur de connexion.')
  })

  it("désactive le bouton pendant la requête", () => {
    isPending = true

    renderWithProviders(<LoginPage />)

    const button = screen.getByRole('button', { name: 'Connexion...' })
    expect(button).toBeDisabled()
  })

  it('redirige vers /users si déjà authentifié', () => {
    renderWithProviders(<LoginPage />, { isAuthenticated: true })

    expect(navigateMock).toHaveBeenCalledWith({ to: '/users' })
  })
})
