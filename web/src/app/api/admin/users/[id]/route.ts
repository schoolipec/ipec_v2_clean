import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSuperAdmin } from '@/lib/auth'

export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSuperAdmin()
    const { id } = await params
    const data = await req.json()

    // No permitir que un superadmin se quite su propio rol
    if (id === session.userId && data.role && data.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No puedes cambiar tu propio rol.' }, { status: 400 })
    }

    const allowed = ['name', 'phone', 'whatsapp', 'telegramId', 'role']
    const updateData: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in data) updateData[key] = data[key]
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true },
    })
    return NextResponse.json(user)
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSuperAdmin()
    const { id } = await params

    if (id === session.userId) {
      return NextResponse.json({ error: 'No puedes eliminarte a ti mismo.' }, { status: 400 })
    }

    await prisma.session.deleteMany({ where: { userId: id } })
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
