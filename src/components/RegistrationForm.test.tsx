import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { screen, fireEvent, cleanup, waitFor } from "@testing-library/react"

import RegistrationForm from "./RegistrationForm"
import { renderWithProviders } from "../test-utils"
import { API_BASE } from "../services/apiService"

const sonnerMocks = vi.hoisted(() => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock("sonner", () => sonnerMocks)

beforeEach(() => {
  sonnerMocks.toast.error.mockClear()
  sonnerMocks.toast.success.mockClear()
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function mockFetchSuccess() {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({}),
  } as Response)
}

function getSaveButton() {
  return screen.getAllByRole("button", { name: /sauvegarder/i })[0]
}

function fillValidFields() {
  fireEvent.change(screen.getByLabelText(/^nom$/i), {
    target: { value: "Dupont" },
  })
  fireEvent.change(screen.getByLabelText(/^prénom$/i), {
    target: { value: "Marie" },
  })
  fireEvent.change(screen.getByLabelText(/^mail$/i), {
    target: { value: "marie.dupont@example.com" },
  })
  fireEvent.change(screen.getByLabelText(/^ville$/i), {
    target: { value: "Lyon" },
  })
  fireEvent.change(screen.getByLabelText(/^code postal$/i), {
    target: { value: "69000" },
  })
}

function selectBirthDate() {
  fireEvent.click(
    screen.getAllByRole("button", { name: /choisir une date/i })[0]
  )
  const dayButton = screen
    .getAllByRole("button")
    .find((b) => /^\d{1,2}$/.test(b.textContent ?? ""))
  if (dayButton) fireEvent.click(dayButton)
}

describe("RegistrationForm", () => {
  it("affiche tous les champs et le bouton", () => {
    renderWithProviders(<RegistrationForm />)

    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^prénom$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^mail$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Date de naissance$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^ville$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^code postal$/i)).toBeInTheDocument()
    expect(getSaveButton()).toBeInTheDocument()
  })

  it("bouton toujours activé pour permettre la validation visuelle", () => {
    renderWithProviders(<RegistrationForm />)
    expect(getSaveButton()).not.toBeDisabled()
  })

  it("affiche les erreurs pour un formulaire vide après soumission", () => {
    renderWithProviders(<RegistrationForm />)

    fireEvent.click(getSaveButton())

    expect(
      screen.getByText(/le nom est requis/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/le prénom est requis/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/L\u2019email est requis/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/la date de naissance est requise/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/la ville est requise/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/le code postal est requis/i)
    ).toBeInTheDocument()
  })

  it("messages d'erreur en rouge après soumission", () => {
    renderWithProviders(<RegistrationForm />)

    fireEvent.click(getSaveButton())

    const errors = screen.getAllByText(/est requis/i)
    errors.forEach((error) => {
      expect(error).toHaveClass("text-red-600")
    })
  })

  it("ne soumet pas via Enter si le formulaire est invalide", () => {
    renderWithProviders(<RegistrationForm />)

    const form = screen.getByLabelText(/^nom$/i).closest("form")!
    fireEvent.submit(form)

    expect(sonnerMocks.toast.success).not.toHaveBeenCalled()
    expect(sonnerMocks.toast.error).not.toHaveBeenCalled()
  })

  it("déclenche un toast success et appelle l'API quand le formulaire est valide", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2005, 0, 1))

    mockFetchSuccess()
    renderWithProviders(<RegistrationForm />)
    fillValidFields()
    selectBirthDate()

    vi.useRealTimers()

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: "Dupont " },
    })

    fireEvent.click(getSaveButton())

    await waitFor(() => {
      expect(sonnerMocks.toast.success).toHaveBeenCalledTimes(1)
    })
    expect(sonnerMocks.toast.error).not.toHaveBeenCalled()
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/users`,
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it("affiche une erreur si on deselectionne la date après l'avoir choisie", () => {
    renderWithProviders(<RegistrationForm />)
    fillValidFields()

    selectBirthDate()

    const dayNumber = screen
      .getAllByRole("button")
      .find((b) => /^\d{1,2}$/.test(b.textContent ?? ""))
    if (dayNumber) fireEvent.click(dayNumber)

    fireEvent.click(getSaveButton())

    expect(
      screen.getByText(/la date de naissance est requise/i)
    ).toBeInTheDocument()
  })

  it("vide les champs après une soumission réussie", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2005, 0, 1))

    mockFetchSuccess()
    renderWithProviders(<RegistrationForm />)
    fillValidFields()
    selectBirthDate()

    vi.useRealTimers()

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: "Dupont " },
    })

    fireEvent.click(getSaveButton())

    await waitFor(() => {
      expect(
        (screen.getByLabelText<HTMLInputElement>(/^nom$/i)).value
      ).toBe("")
    })
    expect(
      (screen.getByLabelText<HTMLInputElement>(/^prénom$/i)).value
    ).toBe("")
    expect(
      (screen.getByLabelText<HTMLInputElement>(/^mail$/i)).value
    ).toBe("")
    expect(
      (screen.getByLabelText<HTMLInputElement>(/^ville$/i)).value
    ).toBe("")
    expect(
      (screen.getByLabelText<HTMLInputElement>(/^code postal$/i)).value
    ).toBe("")
  })

  it("affiche un toast d'erreur si la sauvegarde échoue", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2005, 0, 1))

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
    } as Response)

    renderWithProviders(<RegistrationForm />)
    fillValidFields()
    selectBirthDate()

    vi.useRealTimers()

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: "Dupont " },
    })

    fireEvent.click(getSaveButton())

    await waitFor(() => {
      expect(sonnerMocks.toast.error).toHaveBeenCalledWith(
        "Erreur lors de la sauvegarde.",
      )
    })
  })
})
