import { describe, it, expect, beforeEach } from 'vitest'
import { getUsers, saveUser, clearUsers } from './storageService'

const STORAGE_KEY = 'registered_users'

const user1 = {
  lastName: 'Dupont',
  firstName: 'Marie',
  email: 'marie@example.com',
  birthDate: '2000-01-15',
  city: 'Lyon',
  postalCode: '69000',
}

const user2 = {
  lastName: 'Martin',
  firstName: 'Jean',
  email: 'jean@example.com',
  birthDate: '1995-06-20',
  city: 'Paris',
  postalCode: '75001',
}

beforeEach(() => {
  localStorage.clear()
})

describe('getUsers', () => {
  it('retourne un tableau vide quand rien n\'est stocké', () => {
    expect(getUsers()).toEqual([])
  })

  it('retourne un tableau vide en cas de données JSON invalides', () => {
    localStorage.setItem(STORAGE_KEY, 'pas-du-json')
    expect(getUsers()).toEqual([])
  })
})

describe('saveUser', () => {
  it('sauvegarde et récupère un utilisateur', () => {
    saveUser(user1)
    const users = getUsers()
    expect(users).toHaveLength(1)
    expect(users[0]).toEqual(user1)
  })

  it('conserve plusieurs utilisateurs', () => {
    saveUser(user1)
    saveUser(user2)
    const users = getUsers()
    expect(users).toHaveLength(2)
    expect(users[0]).toEqual(user1)
    expect(users[1]).toEqual(user2)
  })
})

describe('clearUsers', () => {
  it('vide la liste des utilisateurs', () => {
    saveUser(user1)
    clearUsers()
    expect(getUsers()).toEqual([])
  })
})
