import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with support for conditional classes and conflict resolution.
 * uses `clsx` for conditional logic and `tailwind-merge` for conflict handling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
