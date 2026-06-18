import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchUsers, createUser, deleteUser, updateUser, login, API_BASE } from './apiService'

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
]

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('fetchUsers', () => {
  it('récupère et mappe les utilisateurs', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ utilisateurs: rawUsers }),
    } as Response)

    const users = await fetchUsers()
    expect(users).toHaveLength(1)
    expect(users[0]).toEqual({
      id: 1,
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: '2000-01-15',
      city: 'Lyon',
      postalCode: '69000',
    })
    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/users`)
  })

  it("lève une erreur si la réponse n'est pas ok", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)

    await expect(fetchUsers()).rejects.toThrow(
      'Erreur lors de la récupération des utilisateurs',
    )
  })
})

describe('createUser', () => {
  it('envoie les données mappées au format attendu', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response)

    await createUser({
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: '2000-01-15',
      city: 'Lyon',
      postalCode: '69000',
    })

    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Dupont',
        prenom: 'Marie',
        email: 'marie@example.com',
        date_naissance: '2000-01-15',
        ville: 'Lyon',
        code_postal: '69000',
      }),
    })
  })

  it("lève une erreur si la réponse n'est pas ok", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)

    await expect(
      createUser({
        lastName: 'Dupont',
        firstName: 'Marie',
        email: 'marie@example.com',
        birthDate: '2000-01-15',
        city: 'Lyon',
        postalCode: '69000',
      }),
    ).rejects.toThrow("Erreur lors de la création de l'utilisateur")
  })
})

describe('deleteUser', () => {
  it("envoie une requête DELETE sur l'URL de l'utilisateur", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)

    await deleteUser(42)

    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/users/42`, {
      method: 'DELETE',
    })
  })

  it("lève une erreur si la réponse n'est pas ok", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)

    await expect(deleteUser(1)).rejects.toThrow(
      "Erreur lors de la suppression de l'utilisateur",
    )
  })
})

describe('updateUser', () => {
  it('envoie les données mappées au format attendu', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)

    await updateUser(7, {
      lastName: 'Martin',
      firstName: 'Jean',
      email: 'jean@example.com',
      birthDate: '1995-06-20',
      city: 'Paris',
      postalCode: '75001',
    })

    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/users/7`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean@example.com',
        date_naissance: '1995-06-20',
        ville: 'Paris',
        code_postal: '75001',
      }),
    })
  })

  it("lève une erreur si la réponse n'est pas ok", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)

    await expect(
      updateUser(1, {
        lastName: 'X',
        firstName: 'Y',
        email: 'a@b.c',
        birthDate: '2000-01-01',
        city: 'Z',
        postalCode: '12345',
      }),
    ).rejects.toThrow("Erreur lors de la mise à jour de l'utilisateur")
  })
})

describe('login', () => {
  it('retourne true quand le serveur renvoie success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    const result = await login({
      email: 'admin@example.com',
      password: 'secret',
    })
    expect(result).toBe(true)
    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'secret' }),
    })
  })

  it('retourne false quand le serveur renvoie success false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    } as Response)

    const result = await login({
      email: 'admin@example.com',
      password: 'wrong',
    })
    expect(result).toBe(false)
  })

  it("lève une erreur si la réponse n'est pas ok", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response)

    await expect(
      login({ email: 'a@b.com', password: 'x' }),
    ).rejects.toThrow('Erreur de connexion')
  })
})
