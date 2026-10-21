import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ADMIN_PATHS = [
  '/admin/sign-in',
  '/admin/accept-invitation',
  '/api/admin/auth/login',
  '/api/admin/invitations/accept',
];

function isAdminPath(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin');
}

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas del admin: verificar cookie de sesión
  if (isAdminPath(pathname)) {
    if (!isPublicAdminPath(pathname)) {
      const sessionCookie = request.cookies.get('ipec_admin_session');
      if (!sessionCookie?.value) {
        const signInUrl = new URL('/admin/sign-in', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        const redirectRes = NextResponse.redirect(signInUrl);
        // Limpiar cookie del sistema anterior si aún existe en el browser
        redirectRes.cookies.delete('ipec_admin');
        return redirectRes;
      }
    }
    return NextResponse.next();
  }

  // Rutas del sitio público: manejo de internacionalización
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
