import { useMutation } from '@tanstack/react-query'
import { login, type LoginPayload } from '../services/apiService'

/**
 * Hook de mutation pour la connexion administrateur.
 * Appelle l'API {@link login} avec les identifiants fournis.
 *
 * @returns Une mutation React Query contenant `mutate`, `isPending`, etc.
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  })
}
