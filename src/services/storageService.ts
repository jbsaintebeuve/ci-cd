const STORAGE_KEY = 'registered_users'

export type StoredUser = {
  lastName: string
  firstName: string
  email: string
  birthDate: string
  city: string
  postalCode: string
}

export function getUsers(): StoredUser[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data === null) return []
  try {
    return JSON.parse(data) as StoredUser[]
  } catch {
    return []
  }
}

export function saveUser(user: StoredUser): void {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  window.dispatchEvent(new CustomEvent('users-updated'))
}

export function clearUsers(): void {
  localStorage.removeItem(STORAGE_KEY)
}
