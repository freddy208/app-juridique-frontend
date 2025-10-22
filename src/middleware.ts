import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*'],
}