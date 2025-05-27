import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  )
  
  // Clear the authentication cookie by setting an expired cookie
  response.headers.set(
    'Set-Cookie',
    'admin-authenticated=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
  )
  
  return response
}
