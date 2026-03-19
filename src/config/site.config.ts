/**
 * site.config.ts
 * Central place for site-wide settings.
 * Import this wherever you need the site name, default theme, etc.
 */

export const siteConfig = {
  name: 'Kuzafy',
  description: 'WhatsApp business operating system for Kenyan SMEs',

  /** Default color mode on first visit. next-themes persists changes. */
  defaultTheme: 'light' as 'light' | 'dark',

  /** Default sidebar layout variant */
  layout: 'hydrogen' as 'hydrogen' | 'helium' | 'lithium',
} as const;
