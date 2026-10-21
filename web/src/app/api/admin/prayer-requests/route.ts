import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAdminSession();
    const requests = await prisma.prayerRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(requests);
  } catch (err: unknown) {
    const e = err as Error;
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
