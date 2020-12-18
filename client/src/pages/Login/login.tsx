import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleOutlined } from '@ant-design/icons'
import AuthContext from 'contexts/auth-context'
import { auth } from 'utils/firebase'

export default function Login() {
  const { signInWithGoogle } = useContext(AuthContext)
  const navigate = useNavigate()
  const currentUser = auth.currentUser

  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true })
    }
  }, [navigate, currentUser])

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen space-y-4">
      <img
        src={require('images/logo-transparent.svg')}
        alt="Dopplr"
        className="w-16 h-16 -mt-4"
      />
      <p className="-mt-4 text-lg text-gray-800">Welcome to Dopplr</p>
      <button
        className="flex items-center justify-center px-6 py-2 space-x-2 text-white bg-red-400 rounded focus:outline-none"
        onClick={signInWithGoogle}
      >
        <GoogleOutlined />
        <span className="font-semibold">Continue with Google</span>
      </button>
    </div>
  )
}
