import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSuperAdmin } from '@/lib/auth'
import { sendInvitationEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const session = await requireSuperAdmin()
    const { email, role } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese email.' }, { status: 409 })
    }

    // Cancelar invitaciones anteriores no usadas para ese email
    await prisma.userInvitation.updateMany({
      where: { email: email.toLowerCase(), acceptedAt: null },
      data: { expiresAt: new Date() },
    })

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 horas

    const invitation = await prisma.userInvitation.create({
      data: {
        email: email.toLowerCase().trim(),
        role: role || 'ADMIN',
        token,
        invitedById: session.userId,
        expiresAt,
      },
    })

    const inviter = await prisma.user.findUnique({ where: { id: session.userId } })
    const inviterName = inviter?.name || 'Un administrador'

    try {
      await sendInvitationEmail(email, inviterName, token)
    } catch (emailErr) {
      console.error('[send invitation email]', emailErr)
      // No fallamos la invitación si el email falla — guardamos la invitación igual
    }

    return NextResponse.json({ ok: true, invitationId: invitation.id }, { status: 201 })
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await requireSuperAdmin()
    const invitations = await prisma.userInvitation.findMany({
      where: { acceptedAt: null, expiresAt: { gt: new Date() } },
      include: { invitedBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(invitations)
  } catch (err: unknown) {
    const e = err as Error
    if (e.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (e.message === 'FORBIDDEN') return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
