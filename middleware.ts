import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/api/auth/login', '/api/auth/check', '/_next', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for the auth cookie
  const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
  
  // If not authenticated and trying to access protected routes
  if (!isAuthenticated && (pathname.startsWith('/admin') || pathname.startsWith('/api/admin'))) {
    // For API routes, return 401
    if (pathname.startsWith('/api')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    // For pages, redirect to login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
