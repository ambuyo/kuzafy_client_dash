import { Inter, Lexend_Deca } from 'next/font/google';

/**
 * Inter — body text, UI labels, data
 * Used via: font-inter (set on <body>)
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Lexend Deca — headings (h1–h6), sidebar titles, card headers
 * Used via: font-lexend (applied to heading elements in globals.css)
 */
export const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});
