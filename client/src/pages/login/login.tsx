import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons'
import AuthContext from 'contexts/auth-context'
// import BreathingDots from './components/breathing-dots'

export default function Login() {
  const { user, signInWithGoogle, signInWithGithub } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [navigate, user])

  return (
    <div className="flex w-screen h-screen bg-white">
      <div className="flex flex-col items-center justify-center flex-shrink-0 h-full p-8 bg-white shadow-md w-96">
        <img
          src={require('images/logo-transparent.svg')}
          className="w-16 h-16 mb-4"
          alt="Dopplr"
        />
        <div className="mb-1 text-2xl font-bold text-center text-content-primary">
          Login to Dopplr
        </div>
        <div className="mb-8 text-center">
          Connect to your database and start getting insights
        </div>
        <button
          className="flex items-center justify-center w-full px-4 py-2 mb-4 space-x-4 text-base text-white bg-red-500 rounded focus:outline-none"
          onClick={signInWithGoogle}
        >
          <GoogleOutlined className="text-xl" />
          <span className="font-semibold">Continue with Google</span>
        </button>
        <button
          className="flex items-center justify-center w-full px-4 py-2 space-x-4 text-base text-white bg-gray-800 rounded focus:outline-none"
          onClick={signInWithGithub}
        >
          <GithubOutlined className="text-xl" />
          <span className="font-semibold">Continue with Github</span>
        </button>
      </div>
      <div className="flex-1">
        <img
          src="https://images.unsplash.com/photo-1554965650-378bcfce5cac?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
          className="object-cover w-full h-full"
          alt="Display"
        />
        {/* <BreathingDots /> */}
      </div>
    </div>
  )
}
