'use client'

import { signIn, useSession } from 'next-auth/react'
import { Loader } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export default function SigninPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-sm text-muted-foreground">Fetching session...</span>
      </div>
    )
  }

  if (session) {
    redirect('/')
  }

  return (
    <div className="grid h-screen grid-cols-2">
      <div className="flex flex-col bg-muted p-8">
        <div className="flex items-center gap-2">
          <Logo className="h-12 w-12" />
          <div className="font-mono text-3xl font-bold">Dopplr</div>
        </div>
        <div className="flex-1" />
        <div className="text-base text-muted-foreground">
          Dopplr is an innovative dashboarding tool designed for analysts, developers, and data enthusiasts who wish to
          create stunning and interactive visual dashboards using just SQL queries.
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-center text-2xl font-semibold">Welcome to Dopplr</div>
        <div className="mb-8 text-sm text-muted-foreground">
          Unlock the power of intuitive data visualization using SQL.
        </div>
        <Button
          className="mb-6 w-full max-w-md"
          variant="secondary"
          size="lg"
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
            </svg>
          }
          onClick={() => {
            signIn('github', {
              redirect: true,
            })
          }}
        >
          Login with Github
        </Button>
        <div className="relative mb-6 w-full max-w-md border-b after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:transform after:bg-background after:p-2 after:text-sm after:text-muted-foreground after:content-['OR']" />
        <Button
          className="w-full max-w-md"
          variant="outline"
          size="lg"
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M473.16 221.48l-2.26-9.59H262.46v88.22H387c-12.93 61.4-72.93 93.72-121.94 93.72-35.66 0-73.25-15-98.13-39.11a140.08 140.08 0 01-41.8-98.88c0-37.16 16.7-74.33 41-98.78s61-38.13 97.49-38.13c41.79 0 71.74 22.19 82.94 32.31l62.69-62.36C390.86 72.72 340.34 32 261.6 32c-60.75 0-119 23.27-161.58 65.71C58 139.5 36.25 199.93 36.25 256s20.58 113.48 61.3 155.6c43.51 44.92 105.13 68.4 168.58 68.4 57.73 0 112.45-22.62 151.45-63.66 38.34-40.4 58.17-96.3 58.17-154.9 0-24.67-2.48-39.32-2.59-39.96z" />
            </svg>
          }
          onClick={() => {
            signIn('google', {
              redirect: true,
            })
          }}
        >
          Login with Google
        </Button>
      </div>
    </div>
  )
}
