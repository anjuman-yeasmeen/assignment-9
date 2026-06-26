'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './AuthProvider';

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              '!bg-white !text-neutral-900 dark:!bg-neutral-800 dark:!text-neutral-100 !text-sm',
            duration: 3500,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
