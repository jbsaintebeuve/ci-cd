import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import App from './App'
import { renderWithProviders } from './test-utils'

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
    getRouteApi: () => ({
      useRouteContext: () => ({
        isAuthenticated: false,
        login: vi.fn(),
        logout: vi.fn(),
      }),
    }),
  }
})

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('affiche le formulaire d\'inscription', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    renderWithProviders(<App />)
    expect(screen.getByText(/formulaire d'inscription/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument()
  })

  it("n'affiche pas la liste des inscrits quand on est sur la page d'accueil", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    renderWithProviders(<App />)
    expect(screen.queryByText(/inscrits/i)).not.toBeInTheDocument()
  })
})
