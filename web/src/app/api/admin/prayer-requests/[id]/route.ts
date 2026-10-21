import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const data = await req.json();
    const updateData: Record<string, unknown> = {};

    if (data.markRead) updateData.readAt = new Date();
    if (data.markPrayed) updateData.prayedAt = new Date();
    if (data.unmarkPrayed) updateData.prayedAt = null;

    const updated = await prisma.prayerRequest.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const e = err as Error;
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminSession();
    const { id } = await params;
    await prisma.prayerRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const e = err as Error;
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
