import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('ipec_admin_session')?.value
    if (token) {
      await prisma.session.deleteMany({ where: { token } })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('ipec_admin_session', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    })
    return response
  } catch {
    const response = NextResponse.json({ ok: true })
    response.cookies.set('ipec_admin_session', '', { httpOnly: true, maxAge: 0, path: '/' })
    return response
  }
}
