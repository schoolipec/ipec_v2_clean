import { cookies } from 'next/headers'
import { prisma } from './db'

export type AdminSession = {
  userId: string
  email: string
  name: string
  role: string
  mustChangePassword: boolean
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('ipec_admin_session')?.value
    if (!token) return null

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session) return null
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } })
      return null
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      mustChangePassword: session.user.mustChangePassword,
    }
  } catch {
    return null
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  return session
}

export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdminSession()
  if (session.role !== 'SUPER_ADMIN') {
    throw new Error('FORBIDDEN')
  }
  return session
}
