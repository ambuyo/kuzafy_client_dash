import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';

import { inter, lexendDeca } from './fonts';
import { ThemeProvider, StateProvider } from './providers';
import { cn } from '@/lib/cn';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Built with the Isomorphic design system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      /**
       * suppressHydrationWarning is required by next-themes to avoid a
       * hydration mismatch when the theme is read from localStorage on mount.
       */
      suppressHydrationWarning
    >
      <body
        /**
         * - inter.variable   → exposes --font-inter CSS variable
         * - lexendDeca.variable → exposes --font-lexend CSS variable
         * - font-inter       → sets Inter as the default body font
         *
         * Headings are set to font-lexend inside globals.css @layer base.
         */
        className={cn(inter.variable, lexendDeca.variable, 'font-inter')}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {/* Page-transition progress bar — color matches --primary */}
          <NextTopLoader color="rgb(var(--primary-default))" showSpinner={false} />

          <StateProvider>
            {children}
          </StateProvider>

          {/* Global toast container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgb(var(--gray-0))',
                color: 'rgb(var(--foreground))',
                border: '1px solid rgb(var(--muted))',
                fontSize: '0.875rem',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
