'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { PageSpinner } from '@/components/ui/Spinner';

// Client-side guard for private routes. Because auth now lives on a separate
// backend (the JWT is a Bearer token / cross-origin cookie the Next.js server
// can't read), route protection runs on the client.
//
// Crucially, it waits for the auth check to finish before deciding: while
// `loading` is true it shows a spinner rather than redirecting, so a logged-in
// user reloading a private route is never bounced to /login.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) return <PageSpinner label="Checking your session…" />;
  return children;
}
