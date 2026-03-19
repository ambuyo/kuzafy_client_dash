'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { Provider as JotaiProvider } from 'jotai';

/**
 * ThemeProvider
 *
 * Uses `data-theme` attribute (not `.dark` class) to match isomorphic's
 * CSS variable selectors: [data-theme='dark'] { ... }
 *
 * next-themes handles localStorage persistence and SSR hydration.
 */
export function ThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      enableSystem={false}
      defaultTheme="light"
      themes={['light', 'dark']}
    >
      {children}
    </NextThemeProvider>
  );
}

/**
 * StateProvider
 *
 * Wraps jotai's Provider so atoms work anywhere in the tree.
 * Keep this as a separate component so you can add more
 * global providers (React Query, SWR, etc.) here without touching layout.tsx.
 */
export function StateProvider({ children }: React.PropsWithChildren) {
  return <JotaiProvider>{children}</JotaiProvider>;
}
