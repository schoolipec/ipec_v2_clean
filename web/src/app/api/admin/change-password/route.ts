import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'


export async function POST(req: NextRequest) {
  try {
    const session = await requireAdminSession()
    const { newPassword } = await req.json()

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'La contraseÃ±a debe tener al menos 8 caracteres.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash, mustChangePassword: false },
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

