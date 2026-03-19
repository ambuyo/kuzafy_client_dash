import { atom } from 'jotai';

/**
 * atoms.ts
 *
 * Global UI state managed by Jotai.
 * Import individual atoms in any client component — no context needed.
 *
 * Usage:
 *   import { useAtom } from 'jotai';
 *   import { sidebarCollapsedAtom } from '@/lib/atoms';
 *
 *   const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
 */

/** Whether the desktop sidebar is collapsed to icon-only mode */
export const sidebarCollapsedAtom = atom<boolean>(false);

/** Whether the mobile sidebar drawer is open */
export const mobileSidebarOpenAtom = atom<boolean>(false);

/** Active modal key — null means no modal is open */
export const activeModalAtom = atom<string | null>(null);

/** Active drawer key — null means no drawer is open */
export const activeDrawerAtom = atom<string | null>(null);
