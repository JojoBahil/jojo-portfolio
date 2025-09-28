import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get('admin-auth')
    const userCookie = cookieStore.get('admin-user')
    
    console.log('Auth check:', { 
      authCookie: authCookie?.value, 
      userCookie: userCookie?.value 
    })
    
    if (authCookie?.value === 'true' && userCookie?.value) {
      return NextResponse.json({ 
        authenticated: true, 
        username: userCookie.value 
      })
    }
    
    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}