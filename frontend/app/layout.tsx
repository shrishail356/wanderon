import type { Metadata } from 'next';
import './globals.css';

import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme-provider';

export const metadata: Metadata = {
  title: 'Expense Tracker | WanderOn Assignment',
  description: 'A production-grade expense tracking application built with Next.js and TypeScript',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body className={cn('antialiased', fonts)}>
        <ThemeProvider
          attribute='data-theme'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
