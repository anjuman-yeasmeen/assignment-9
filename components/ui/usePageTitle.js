'use client';

import { useEffect } from 'react';

// Route-based dynamic <title> for client pages (server pages use `metadata`).
export default function usePageTitle(title) {
  useEffect(() => {
    if (title) document.title = `${title} | IdeaVault`;
  }, [title]);
}
