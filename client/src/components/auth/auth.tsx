import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { auth, googleAuthProvider, githubAuthProvider } from 'utils/firebase'
import AuthContext from 'contexts/auth-context'
import { message, Spin } from 'antd'

type AuthProps = {
  children: React.ReactElement
}

export default function Auth({ children }: AuthProps) {
  const [authVerified, setAuthVerified] = useState(false)
  const [user, setUser] = useState<firebase.User | null>(auth.currentUser)

  useEffect(() => {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser)
      } else {
        setUser(null)
      }
      setAuthVerified(true)
    })
  }, [])

  async function signInWithGoogle() {
    try {
      await auth.signInWithPopup(googleAuthProvider)
    } catch (error) {
      message.error(error.message)
    }
  }

  async function signInWithGithub() {
    try {
      await auth.signInWithPopup(githubAuthProvider)
    } catch (error) {
      message.error(error.message)
    }
  }

  async function signOut() {
    try {
      await auth.signOut()
    } catch (error) {
      message.error(error.message)
    }
  }

  if (!authVerified) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <Spin tip="Verifying User..." />
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signOut,
        signInWithGoogle,
        signInWithGithub,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
