import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'


export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseÃ±a son requeridos.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseÃ±a debe tener al menos 8 caracteres.' }, { status: 400 })
    }

    const invitation = await prisma.userInvitation.findUnique({ where: { token } })

    if (!invitation) {
      return NextResponse.json({ error: 'InvitaciÃ³n no vÃ¡lida.' }, { status: 404 })
    }
    if (invitation.acceptedAt) {
      return NextResponse.json({ error: 'Esta invitaciÃ³n ya fue usada.' }, { status: 400 })
    }
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Esta invitaciÃ³n ha expirado.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email: invitation.email,
        name: invitation.email.split('@')[0],
        passwordHash,
        role: invitation.role,
        mustChangePassword: false,
      },
    })

    await prisma.userInvitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    })

    // Crear sesiÃ³n automÃ¡ticamente
    const sessionToken = randomBytes(48).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.session.create({
      data: { userId: user.id, token: sessionToken, expiresAt },
    })

    const response = NextResponse.json({ ok: true, role: user.role })
    response.cookies.set('ipec_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('[accept invitation]', err)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

