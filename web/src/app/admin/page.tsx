import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { prisma as db } from '@/lib/db';
import AdminShell from '@/app/admin/_components/AdminShell';
import AdminDashboard from '@/app/admin/_components/AdminDashboard';

export default async function AdminRoot() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/sign-in');
  if (session.mustChangePassword) redirect('/admin/change-password');

  const isSuperOrAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(session.role);
  const userCount = isSuperOrAdmin ? await db.user.count() : null;

  return (
    <AdminShell>
      <AdminDashboard
        userName={session.name || session.email}
        userRole={session.role}
        userCount={userCount}
      />
    </AdminShell>
  );
}
