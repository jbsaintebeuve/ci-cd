/** Données saisies dans le formulaire d'inscription */
export type FormData = {
  lastName: string
  firstName: string
  email: string
  birthDate: Date | undefined
  city: string
  postalCode: string
}

/** Erreurs de validation indexées par champ du formulaire */
export type FormErrors = Partial<Record<keyof FormData, string>>

/**
 * Vérifie qu'un nom/prénom ne contient que des lettres, espaces, apostrophes ou tirets.
 *
 * @param value - La chaîne à valider
 * @returns `true` si la chaîne est valide
 */
export function isValidName(value: string): boolean {
  return /^[\p{L}\s'\-]+$/u.test(value.trim())
}

/**
 * Vérifie qu'un email respecte le format basique `texte@texte.texte`.
 *
 * @param value - L'email à valider
 * @returns `true` si le format est correct
 */
export function isValidEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value.trim())
}

/**
 * Vérifie qu'un code postal français est valide (5 chiffres).
 *
 * @param value - Le code postal à valider
 * @returns `true` si le code postal est au format 5 chiffres
 */
export function isValidPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim())
}

/**
 * Vérifie si une date de naissance correspond à une personne majeure (18 ans ou plus).
 *
 * @param birthDate - La date de naissance à vérifier
 * @returns `true` si l'âge est supérieur ou égal à 18 ans
 */
export function isAdult(birthDate: Date): boolean {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age >= 18
}

/**
 * Valide l'intégralité du formulaire et retourne les erreurs champ par champ.
 *
 * @param data - Les données du formulaire à valider
 * @returns Objet contenant les messages d'erreur pour chaque champ invalide (vide si tout est valide)
 */
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
