import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import UserList from './UserList'
import { saveUser } from '../services/storageService'

const user1 = {
  lastName: 'Dupont',
  firstName: 'Marie',
  email: 'marie@example.com',
  birthDate: '2000-01-15',
  city: 'Lyon',
  postalCode: '69000',
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})

describe('UserList', () => {
  it('affiche un message quand la liste est vide', () => {
    render(<UserList />)
    expect(screen.getByText(/aucun inscrit/i)).toBeInTheDocument()
  })

  it('affiche les utilisateurs quand il y en a', () => {
    saveUser(user1)
    render(<UserList />)
    expect(screen.getByText(/marie dupont/i)).toBeInTheDocument()
    expect(screen.getByText(/marie@example\.com/i)).toBeInTheDocument()
  })

  it('affiche le nombre d\'inscrits', () => {
    saveUser(user1)
    render(<UserList />)
    expect(
      screen.getAllByText(/inscrits \(1\)/i).length
    ).toBeGreaterThan(0)
  })

  it('démonte sans erreur', () => {
    const { unmount } = render(<UserList />)
    expect(() => unmount()).not.toThrow()
  })

  it("se met à jour quand l'événement users-updated est déclenché", () => {
    render(<UserList />)
    expect(screen.getByText(/aucun inscrit/i)).toBeInTheDocument()

    act(() => { saveUser(user1) })

    expect(screen.getByText(/marie dupont/i)).toBeInTheDocument()
    expect(screen.getByText(/inscrits \(1\)/i)).toBeInTheDocument()
  })

  it('affiche les informations de plusieurs utilisateurs', () => {
    saveUser({
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: '2000-01-15',
      city: 'Lyon',
      postalCode: '69000',
    })
    saveUser({
      lastName: 'Martin',
      firstName: 'Jean',
      email: 'jean@example.com',
      birthDate: '1995-06-20',
      city: 'Paris',
      postalCode: '75001',
    })
    render(<UserList />)
    expect(screen.getByText(/marie dupont/i)).toBeInTheDocument()
    expect(screen.getByText(/jean martin/i)).toBeInTheDocument()
    expect(screen.getByText(/inscrits \(2\)/i)).toBeInTheDocument()
  })
})
