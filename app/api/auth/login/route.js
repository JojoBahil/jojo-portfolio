import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    console.log('Login attempt:', { 
      username, 
      providedUser: process.env.ADMIN_USER,
      passwordMatch: password === process.env.ADMIN_PASS 
    })

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      const cookieStore = cookies()
      
      // Set authentication cookie
      cookieStore.set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      
      cookieStore.set('admin-user', username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
      
      console.log('Cookies set successfully')
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}