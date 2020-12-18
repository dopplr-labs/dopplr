import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
// import 'firebase/auth'
import { auth, googleProvider } from 'utils/firebase'
import AuthContext from 'contexts/auth-context'
import { Spin } from 'antd'

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
    auth.signInWithPopup(googleProvider)
  }

  async function signOut() {
    await auth.signOut()
    return true
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
