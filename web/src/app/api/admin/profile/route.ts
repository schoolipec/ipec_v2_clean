import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdminSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await requireAdminSession()
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true, email: true, name: true, role: true,
        phone: true, whatsapp: true, telegramId: true,
        twoFactorEnabled: true, createdAt: true, lastLoginAt: true,
        notifyTelegramPrayer: true, notifyEmailPrayer: true,
      },
    })
    return NextResponse.json(user)
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdminSession()
    const data = await req.json()

    const allowed = ['name', 'phone', 'whatsapp', 'telegramId', 'notifyTelegramPrayer', 'notifyEmailPrayer']
    const updateData: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in data) updateData[key] = data[key]
    }

    // Cambio de email — requiere contraseña actual
    if (data.newEmail) {
      const user = await prisma.user.findUnique({ where: { id: session.userId } })
      if (!user) return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })

      const valid = await bcrypt.compare(data.currentPassword || '', user.passwordHash)
      if (!valid) return NextResponse.json({ error: 'Contraseña incorrecta. Requerida para cambiar el correo.' }, { status: 400 })

      const newEmail = data.newEmail.trim().toLowerCase()
      if (!newEmail.includes('@')) return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 })

      const exists = await prisma.user.findUnique({ where: { email: newEmail } })
      if (exists && exists.id !== session.userId) {
        return NextResponse.json({ error: 'Ese correo ya está en uso por otro usuario.' }, { status: 400 })
      }
      updateData.email = newEmail
    }

    if (data.newPassword) {
      const user = await prisma.user.findUnique({ where: { id: session.userId } })
      if (!user) return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })

      const valid = await bcrypt.compare(data.currentPassword || '', user.passwordHash)
      if (!valid) {
        return NextResponse.json({ error: 'Contraseña actual incorrecta.' }, { status: 400 })
      }
      if (data.newPassword.length < 8) {
        return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' }, { status: 400 })
      }

      updateData.passwordHash = await bcrypt.hash(data.newPassword, 12)
      updateData.mustChangePassword = false
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: { id: true, email: true, name: true, phone: true, whatsapp: true, telegramId: true, notifyTelegramPrayer: true, notifyEmailPrayer: true },
    })

    return NextResponse.json(user)
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
