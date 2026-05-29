const STORAGE_KEY = 'registered_users'

/** Utilisateur tel qu'enregistré dans le localStorage */
export type StoredUser = {
  lastName: string
  firstName: string
  email: string
  birthDate: string
  city: string
  postalCode: string
}

/**
 * Récupère la liste des utilisateurs enregistrés dans le localStorage.
 *
 * @returns Tableau des utilisateurs stockés, ou tableau vide si aucune donnée
 */
export function getUsers(): StoredUser[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data === null) return []
  try {
    return JSON.parse(data) as StoredUser[]
  } catch {
    return []
  }
}

/**
 * Ajoute un utilisateur à la liste stockée et notifie les autres onglets.
 *
 * @param user - L'utilisateur à sauvegarder
 */
export function saveUser(user: StoredUser): void {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  window.dispatchEvent(new CustomEvent('users-updated'))
}

/** Supprime tous les utilisateurs enregistrés du localStorage */
export function clearUsers(): void {
  localStorage.removeItem(STORAGE_KEY)
}
