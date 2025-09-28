import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin-auth')
  const userCookie = cookieStore.get('admin-user')
  
  return {
    isLoggedIn: authCookie?.value === 'true',
    username: userCookie?.value
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    throw new Error('Unauthorized')
  }
  return session
}
