'use client';

import { Suspense, lazy } from 'react';

const ThemeProvider = lazy(() => import('@/components/ThemeProvider'));

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider>{children}</ThemeProvider>
    </Suspense>
  );
}
