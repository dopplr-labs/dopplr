import { createContext } from 'react'
import firebase from 'firebase/app'

const AuthContext = createContext<{
  user: firebase.User | null
  signOut: () => Promise<boolean>
  signInWithGoogle: () => void
}>({
  user: null,
  signOut: async () => false,
  signInWithGoogle: () => {},
})

export default AuthContext
