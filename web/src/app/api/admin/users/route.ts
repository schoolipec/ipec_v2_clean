import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSuperAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin()
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true,
        phone: true, whatsapp: true, telegramId: true,
        mustChangePassword: true, twoFactorEnabled: true,
        createdAt: true, lastLoginAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(users)
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin()
    const { email, name, role, password } = await req.json()

    if (!email || !name) {
      return NextResponse.json({ error: 'Email y nombre son requeridos.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese email.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password || 'temporal_cambiar', 12)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name,
        passwordHash,
        role: role || 'ADMIN',
        mustChangePassword: !password,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
