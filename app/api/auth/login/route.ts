import { NextResponse } from 'next/server'

// In a real app, use environment variables for the password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'iveta'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json(
        { success: true },
        { status: 200 }
      )
      
      // Set a secure HTTP-only cookie that expires in 7 days
      response.headers.set(
        'Set-Cookie',
        `admin-authenticated=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      )
      
      return response
    }

    return NextResponse.json(
      { success: false, error: 'Nesprávné heslo' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Neplatný požadavek' },
      { status: 400 }
    )
  }
}
