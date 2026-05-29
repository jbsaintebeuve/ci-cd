import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Fusionne les classes CSS Tailwind avec prise en charge des conflits.
 * Utilise `clsx` pour les conditions et `tailwind-merge` pour résoudre les conflits.
 *
 * @param inputs - Liste de classes, d'objets conditionnels ou de tableaux
 * @returns Chaîne de classes CSS fusionnées et dédupliquées
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

