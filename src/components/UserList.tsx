import { useState, useEffect } from 'react'
import { getUsers, type StoredUser } from '../services/storageService'

export default function UserList() {
  const [users, setUsers] = useState<StoredUser[]>(() => getUsers())

  useEffect(() => {
    const handleUpdate = () => setUsers(getUsers())
    window.addEventListener('storage', handleUpdate)
    window.addEventListener('users-updated', handleUpdate)
    return () => {
      window.removeEventListener('storage', handleUpdate)
      window.removeEventListener('users-updated', handleUpdate)
    }
  }, [])

  if (users.length === 0) {
    return (
      <section className="mx-auto mt-10 w-full max-w-xl p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Inscrits
        </h2>
        <p className="mt-2 text-sm text-slate-500">Aucun inscrit pour le moment.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-xl p-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Inscrits ({users.length})
      </h2>
      <ul className="mt-4 space-y-3">
        {users.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-lg border p-4 text-sm"
          >
            <span>
              {user.firstName} {user.lastName}
            </span>
            <span className="text-slate-500">{user.email}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
