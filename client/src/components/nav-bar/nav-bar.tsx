import React, { useContext, useMemo } from 'react'
import { Button, Dropdown, Menu } from 'antd'
import AuthContext from 'contexts/auth-context'

export default function Navbar() {
  const { user, signOut } = useContext(AuthContext)

  const avatarMenu = useMemo(() => {
    return (
      <Menu className="w-56 text-gray-700 divide-y">
        <div className="px-4 py-2">
          <div>{user?.displayName}</div>
          <div className="text-xs text-gray-400">{user?.email}</div>
        </div>
        <div className="px-4 py-2 cursor-pointer hover:bg-gray-50">
          <Button className="w-full" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </Menu>
    )
  }, [signOut, user])

  return (
    <div className="relative z-10 flex items-center h-12 px-8 bg-gray-800">
      <img
        src={require('images/logo-transparent.svg')}
        alt="Dopplr"
        className="w-8 h-8 mr-2"
      />
      <div className="text-base font-bold text-white">Dopplr</div>
      <div className="flex-1" />
      <Dropdown overlay={avatarMenu} trigger={['click']}>
        <button className="w-8 h-8 overflow-hidden bg-gray-100 rounded-full focus:outline-none">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="user profile" />
          ) : null}
        </button>
      </Dropdown>
    </div>
  )
}
