import { createContext } from 'react'
import firebase from 'firebase/app'

const AuthContext = createContext<{
  user: firebase.User | null
  signOut: () => void
  signInWithGoogle: () => void
  signInWithGithub: () => void
}>({
  user: null,
  signOut: async () => {},
  signInWithGoogle: () => {},
  signInWithGithub: () => {},
})

export default AuthContext
