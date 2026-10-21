import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — IPEC',
  robots: { index: false, follow: false },
};

// El admin maneja su propio fondo en AdminShell (soporta dark/light).
// Este layout solo neutraliza el background del body público.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {children}
    </div>
  );
}
