import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getUserAuth() {
  const session = await getServerSession(authOptions)
  return { session }
}

export async function checkAuth() {
  const { session } = await getUserAuth()
  if (!session) {
    redirect('/api/auth/signin')
  }
}
