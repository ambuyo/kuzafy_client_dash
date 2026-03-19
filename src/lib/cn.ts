import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — merge Tailwind classes safely.
 *
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 * Use this everywhere instead of string concatenation or template literals.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary text-primary-foreground', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
