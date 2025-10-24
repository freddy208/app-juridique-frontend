import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 🔍 On vérifie si le cookie JWT est présent
  const accessToken = request.cookies.get('access_token')

  // Pages d'auth publique (login, register, forgot-password, etc.)
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname.startsWith('/reset-password')

  // 🔒 Si l'utilisateur n'a pas de cookie et tente d'accéder à une page protégée
  if (!accessToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🔓 Si l'utilisateur est déjà connecté et essaie d'aller sur /login
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL('/parametres/utilisateur', request.url))
  }

  return NextResponse.next()
}

// ✅ Définis ici les routes à protéger
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/parametres/:path*',
    '/admin/:path*',
    '/profil/:path*',
  ],
}
