import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  isValidName,
  isValidEmail,
  isValidPostalCode,
  isAdult,
  validateForm,
} from './validation'

describe('isValidName', () => {
  it('accepte les noms simples', () => {
    expect(isValidName('Jean')).toBe(true)
  })

  it('accepte les noms composés avec tiret', () => {
    expect(isValidName('Jean-Pierre')).toBe(true)
  })

  it('accepte les noms avec accents', () => {
    expect(isValidName('José')).toBe(true)
    expect(isValidName('François')).toBe(true)
  })

  it('accepte les noms avec tréma', () => {
    expect(isValidName('Müller')).toBe(true)
    expect(isValidName('Özlem')).toBe(true)
  })

  it('accepte les noms avec apostrophe', () => {
    expect(isValidName("D'Artagnan")).toBe(true)
  })

  it('accepte les lettres nordiques', () => {
    expect(isValidName('Søren')).toBe(true)
  })

  it('accepte les espaces', () => {
    expect(isValidName('Marie Claire')).toBe(true)
  })

  it('rejette les noms avec chiffres', () => {
    expect(isValidName('Jean123')).toBe(false)
  })

  it('rejette les noms avec caractères spéciaux', () => {
    expect(isValidName('Jean@Pierre')).toBe(false)
    expect(isValidName('Jean!')).toBe(false)
    expect(isValidName('Test_')).toBe(false)
  })

  it('rejette les balises HTML', () => {
    expect(isValidName('<script>')).toBe(false)
  })

  it('rejette la chaîne vide', () => {
    expect(isValidName('')).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('accepte les emails valides', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('a.b@c.co')).toBe(true)
    expect(isValidEmail('user+tag@domain.fr')).toBe(true)
  })

  it('rejette la chaîne vide', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejette un email sans @', () => {
    expect(isValidEmail('test')).toBe(false)
  })

  it('rejette un email sans domaine', () => {
    expect(isValidEmail('test@')).toBe(false)
  })

  it('rejette un email sans point', () => {
    expect(isValidEmail('test@example')).toBe(false)
  })
})

describe('isValidPostalCode', () => {
  it('accepte les codes postaux à 5 chiffres', () => {
    expect(isValidPostalCode('69000')).toBe(true)
    expect(isValidPostalCode('75001')).toBe(true)
    expect(isValidPostalCode('13250')).toBe(true)
  })

  it('rejette la chaîne vide', () => {
    expect(isValidPostalCode('')).toBe(false)
  })

  it('rejette un code trop court', () => {
    expect(isValidPostalCode('1234')).toBe(false)
  })

  it('rejette un code trop long', () => {
    expect(isValidPostalCode('123456')).toBe(false)
  })

  it('rejette les codes avec lettres', () => {
    expect(isValidPostalCode('12A45')).toBe(false)
    expect(isValidPostalCode('ABCDE')).toBe(false)
  })
})

describe('isAdult', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('retourne true pour une personne de 20 ans', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 15))
    expect(isAdult(new Date(2004, 0, 15))).toBe(true)
  })

  it('retourne true pour une personne qui a exactement 18 ans', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 15))
    expect(isAdult(new Date(2006, 0, 15))).toBe(true)
  })

  it('retourne false pour une personne de 17 ans', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 15))
    expect(isAdult(new Date(2007, 0, 15))).toBe(false)
  })

  it('retourne false pour une personne qui aura 18 ans demain', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 15))
    expect(isAdult(new Date(2006, 0, 16))).toBe(false)
  })

  it('retourne false pour une date future', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 15))
    expect(isAdult(new Date(2025, 0, 15))).toBe(false)
  })
})

describe('validateForm', () => {
  it('retourne un objet vide pour un formulaire valide', () => {
    const result = validateForm({
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: new Date(2000, 0, 1),
      city: 'Lyon',
      postalCode: '69000',
    })
    expect(result).toEqual({})
  })

  it('retourne toutes les erreurs pour un formulaire vide', () => {
    const result = validateForm({
      lastName: '',
      firstName: '',
      email: '',
      birthDate: undefined,
      city: '',
      postalCode: '',
    })
    expect(result.lastName).toBe('Le nom est requis.')
    expect(result.firstName).toBe('Le prénom est requis.')
    expect(result.email).toBe('L’email est requis.')
    expect(result.birthDate).toBe('La date de naissance est requise.')
    expect(result.city).toBe('La ville est requise.')
    expect(result.postalCode).toBe('Le code postal est requis.')
  })

  it('retourne une erreur pour un email invalide', () => {
    const result = validateForm({
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'pas-un-email',
      birthDate: new Date(2000, 0, 1),
      city: 'Lyon',
      postalCode: '69000',
    })
    expect(result.email).toBe('Le format de l’email est invalide.')
  })

  it('retourne une erreur pour un code postal invalide', () => {
    const result = validateForm({
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: new Date(2000, 0, 1),
      city: 'Lyon',
      postalCode: '123',
    })
    expect(result.postalCode).toBe('Le code postal doit contenir 5 chiffres.')
  })

  it("retourne une erreur pour un nom avec chiffres", () => {
    const result = validateForm({
      lastName: 'Dupont123',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: new Date(2000, 0, 1),
      city: 'Lyon',
      postalCode: '69000',
    })
    expect(result.lastName).toBe('Le nom contient des caractères invalides.')
  })

  it("retourne une erreur pour un prénom avec caractères spéciaux", () => {
    const result = validateForm({
      lastName: 'Dupont',
      firstName: 'Marie@',
      email: 'marie@example.com',
      birthDate: new Date(2000, 0, 1),
      city: 'Lyon',
      postalCode: '69000',
    })
    expect(result.firstName).toBe('Le prénom contient des caractères invalides.')
  })

  it("retourne une erreur pour une ville avec chiffres", () => {
    const result = validateForm({
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: new Date(2000, 0, 1),
      city: 'Lyon42',
      postalCode: '69000',
    })
    expect(result.city).toBe('La ville contient des caractères invalides.')
  })

  it("retourne une erreur pour un mineur", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 15))

    const result = validateForm({
      lastName: 'Dupont',
      firstName: 'Marie',
      email: 'marie@example.com',
      birthDate: new Date(2010, 0, 15),
      city: 'Lyon',
      postalCode: '69000',
    })
    expect(result.birthDate).toBe('Vous devez avoir au moins 18 ans.')

    vi.useRealTimers()
  })
})
