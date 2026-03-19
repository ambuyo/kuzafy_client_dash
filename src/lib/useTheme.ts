'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * useTheme
 *
 * Thin wrapper around next-themes' useTheme that handles the common
 * SSR hydration gotcha: `theme` is undefined on first render.
 *
 * Usage:
 *   const { theme, setTheme, isDark, isLight, mounted } = useTheme();
 *
 *   // Always guard with `mounted` before rendering theme-dependent UI
 *   if (!mounted) return <Skeleton />;
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme, themes } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme,
    setTheme,
    resolvedTheme,
    themes,
    mounted,
    isDark:  resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    toggle:  () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
}
