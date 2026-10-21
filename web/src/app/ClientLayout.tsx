'use client';

import { Suspense, lazy, useEffect } from 'react';

const ThemeProvider = lazy(() => import('@/components/ThemeProvider'));

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <Suspense fallback={null}>
      <ThemeProvider>{children}</ThemeProvider>
    </Suspense>
  );
}
