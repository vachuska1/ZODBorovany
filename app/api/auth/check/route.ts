import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const isAuthenticated = cookie.includes('admin-authenticated=true')
  
  return NextResponse.json({ authenticated: isAuthenticated })
}
