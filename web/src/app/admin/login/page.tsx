'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirección al nuevo sistema de sign-in
export default function AdminLoginRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/sign-in'); }, [router]);
  return null;
}
