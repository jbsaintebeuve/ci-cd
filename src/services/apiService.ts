/** URL de base du serveur backend */
const API_BASE = 'http://localhost:8000'

/** Représentation client d'un utilisateur après mapping depuis l'API */
export type User = {
  id: number
  lastName: string
  firstName: string
  email: string
  birthDate: string
  city: string
  postalCode: string
}

/** Données envoyées à l'API pour créer ou modifier un utilisateur */
export type CreateUserPayload = {
  lastName: string
  firstName: string
  email: string
  birthDate: string
  city: string
  postalCode: string
}

/** Identifiants de connexion administrateur */
export type LoginPayload = {
  email: string
  password: string
}

/**
 * Récupère la liste des utilisateurs depuis l'API et mappe les champs
 * du format serveur (`nom`, `prenom`, `date_naissance`, `ville`, `code_postal`)
 * vers le format client (`lastName`, `firstName`, `birthDate`, `city`, `postalCode`).
 *
 * @returns Un tableau d'objets {@link User}
 * @throws {Error} Si la réponse du serveur n'est pas ok
 */
export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`)
  if (!res.ok) throw new Error('Erreur lors de la récupération des utilisateurs')
  const data = await res.json()
  return data.utilisateurs.map(
    (u: Record<string, unknown>) =>
      ({
        id: u.id as number,
        lastName: u.nom as string,
        firstName: u.prenom as string,
        email: u.email as string,
        birthDate: u.date_naissance as string,
        city: u.ville as string,
        postalCode: u.code_postal as string,
      }) satisfies User,
  )
}

/**
 * Crée un nouvel utilisateur en envoyant les données au format attendu par le serveur.
 *
 * @param payload - Les données de l'utilisateur au format {@link CreateUserPayload}
 * @throws {Error} Si la réponse du serveur n'est pas ok
 */
export async function createUser(payload: CreateUserPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom: payload.lastName,
      prenom: payload.firstName,
      email: payload.email,
      date_naissance: payload.birthDate,
      ville: payload.city,
      code_postal: payload.postalCode,
    }),
  })
  if (!res.ok) throw new Error("Erreur lors de la création de l'utilisateur")
}

/**
 * Supprime un utilisateur par son identifiant.
 *
 * @param id - L'identifiant de l'utilisateur à supprimer
 * @throws {Error} Si la réponse du serveur n'est pas ok
 */
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'utilisateur")
}

/**
 * Met à jour les données d'un utilisateur existant.
 *
 * @param id - L'identifiant de l'utilisateur à modifier
 * @param payload - Les nouvelles données au format {@link CreateUserPayload}
 * @throws {Error} Si la réponse du serveur n'est pas ok
 */
export async function updateUser(id: number, payload: CreateUserPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom: payload.lastName,
      prenom: payload.firstName,
      email: payload.email,
      date_naissance: payload.birthDate,
      ville: payload.city,
      code_postal: payload.postalCode,
    }),
  })
  if (!res.ok) throw new Error("Erreur lors de la mise à jour de l'utilisateur")
}

/**
 * Tente une connexion administrateur avec les identifiants fournis.
 *
 * @param payload - L'email et le mot de passe
 * @returns `true` si le serveur a renvoyé `{ success: true }`, sinon `false`
 * @throws {Error} Si la réponse HTTP du serveur n'est pas ok
 */
export async function login(payload: LoginPayload): Promise<boolean> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Erreur de connexion')
  const data = await res.json()
  return data.success as boolean
}
