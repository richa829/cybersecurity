import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /auth/login)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/signup", "/auth/forgot-password"]

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // For demo mode, we need to check localStorage on the client side
  // So we'll allow access to protected routes and let the client handle auth
  if (path.startsWith("/dashboard") || path.startsWith("/auth")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
