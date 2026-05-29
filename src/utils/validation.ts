export type FormData = {
  lastName: string
  firstName: string
  email: string
  birthDate: Date | undefined
  city: string
  postalCode: string
}

export type FormErrors = Partial<Record<keyof FormData, string>>

/** VERIF NOM VALIDE */
export function isValidName(value: string): boolean {
  return /^[\p{L}\s'\-]+$/u.test(value.trim())
}

/** VERIF EMAIL VALIDE */
export function isValidEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value.trim())
}

/** VERIF CODE POSTAL VALIDE */
export function isValidPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim())
}

/** VERIF MAJEUR (18 ANS) */
export function isAdult(birthDate: Date): boolean {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age >= 18
}

/** VALIDER FORMULAIRE ET RETOURNER ERREURS */
export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.lastName.trim()) {
    errors.lastName = 'Le nom est requis.'
  } else if (!isValidName(data.lastName)) {
    errors.lastName = 'Le nom contient des caractères invalides.'
  }

  if (!data.firstName.trim()) {
    errors.firstName = 'Le prénom est requis.'
  } else if (!isValidName(data.firstName)) {
    errors.firstName = 'Le prénom contient des caractères invalides.'
  }

  if (!data.email.trim()) {
    errors.email = 'L\u2019email est requis.'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Le format de l\u2019email est invalide.'
  }

  if (!data.birthDate) {
    errors.birthDate = 'La date de naissance est requise.'
  } else if (!isAdult(data.birthDate)) {
    errors.birthDate = 'Vous devez avoir au moins 18 ans.'
  }

  if (!data.city.trim()) {
    errors.city = 'La ville est requise.'
  } else if (!isValidName(data.city)) {
    errors.city = 'La ville contient des caractères invalides.'
  }

  if (!data.postalCode.trim()) {
    errors.postalCode = 'Le code postal est requis.'
  } else if (!isValidPostalCode(data.postalCode)) {
    errors.postalCode = 'Le code postal doit contenir 5 chiffres.'
  }

  return errors
}
