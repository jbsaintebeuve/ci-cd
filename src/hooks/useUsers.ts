import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
  type CreateUserPayload,
  type User,
} from '../services/apiService'

/**
 * Hook de requête qui récupère la liste des utilisateurs depuis l'API.
 * Met en cache le résultat sous la clé `['users']`.
 *
 * @returns Une requête React Query contenant `data`, `isLoading`, `isError`, etc.
 */
export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}

/**
 * Hook de mutation pour créer un nouvel utilisateur.
 * Invalide le cache `['users']` après une création réussie.
 *
 * @returns Une mutation React Query contenant `mutate`, `isPending`, etc.
 */
export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * Hook de mutation pour supprimer un utilisateur par son identifiant.
 * Invalide le cache `['users']` après une suppression réussie.
 *
 * @returns Une mutation React Query contenant `mutate`, `isPending`, etc.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * Hook de mutation pour mettre à jour un utilisateur existant.
 * Invalide le cache `['users']` après une mise à jour réussie.
 *
 * @returns Une mutation React Query contenant `mutate`, `isPending`, etc.
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
