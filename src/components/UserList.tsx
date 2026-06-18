import { useState } from 'react'
import { useUsersQuery } from '../hooks/useUsers'
import type { User } from '../services/apiService'
import { Button } from './ui/button'
import UserManageDialog from './UserManageDialog'
import { useAuth } from '../contexts/AuthContext'

/**
 * Masque le nom de famille en ne gardant que l'initiale suivie d'un point.
 *
 * @param name - Le nom complet (ex: "Dupont")
 * @returns Le nom censuré (ex: "D.")
 */
function censorLastName(name: string): string {
  return name.charAt(0) + '.'
}

/**
 * Masque l'email en conservant la première et la dernière lettre
 * de la partie locale, et le domaine complet.
 *
 * @param email - L'adresse email complète (ex: "jean@example.com")
 * @returns L'email censuré (ex: "j****n@example.com")
 */
function censorEmail(email: string): string {
  const atIndex = email.indexOf('@')
  if (atIndex <= 1) return email
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex)
  const first = local.charAt(0)
  const last = local.charAt(local.length - 1)
  return first + '****' + last + domain
}

export default function UserList() {
  const { isAuthenticated } = useAuth()
  const { data: users, isLoading, isError } = useUsersQuery()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  if (isLoading) {
    return (
      <section className="mx-auto mt-10 w-full max-w-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900">Inscrits</h2>
        <p className="mt-2 text-sm text-slate-500">Chargement...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="mx-auto mt-10 w-full max-w-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900">Inscrits</h2>
        <p className="mt-2 text-sm text-red-600">
          Erreur lors du chargement des utilisateurs.
        </p>
      </section>
    )
  }

  if (!users || users.length === 0) {
    return (
      <section className="mx-auto mt-10 w-full max-w-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900">Inscrits</h2>
        <p className="mt-2 text-sm text-slate-500">
          Aucun inscrit pour le moment.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-xl p-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Inscrits ({users.length})
      </h2>
      <ul className="mt-4 space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between rounded-lg border p-4 text-sm"
          >
            <span>
              {user.firstName}{' '}
              {isAuthenticated
                ? user.lastName
                : censorLastName(user.lastName)}
            </span>
            <span className="text-slate-500">
              {isAuthenticated ? user.email : censorEmail(user.email)}
            </span>
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(user)}
              >
                Gérer
              </Button>
            )}
          </li>
        ))}
      </ul>

      <UserManageDialog
        user={selectedUser}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null)
        }}
      />
    </section>
  )
}
