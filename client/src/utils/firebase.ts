import firebase from 'firebase/app'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appID: process.env.REACT_APP_FIREBASE_APP_ID,
})

export const auth = firebase.auth()

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const githubAuthProvider = new firebase.auth.GithubAuthProvider()
