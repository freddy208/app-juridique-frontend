// middleware.ts
import { NextResponse } from 'next/server'

export function middleware() {
  // ✅ Désactivé temporairement - on protège côté client
  return NextResponse.next()
}

// Commentez aussi le config
// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/parametres/:path*',
//     '/admin/:path*',
//     '/profil/:path*',
//   ],
// }