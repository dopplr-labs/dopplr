import { useContext, useEffect } from 'react'
import LogRocket from 'logrocket'
import AuthContext from 'contexts/auth-context'

export default function Logrocket() {
  const { user } = useContext(AuthContext)
  useEffect(() => {
    if (user) {
      LogRocket.init(process.env.REACT_APP_LOGROCKET_APP_ID ?? '')
      LogRocket.identify((Math.random(), 2, 5).toString(), {
        name: user.displayName ?? 'visitor',
        email: user.email ?? 'someone@example.com',
      })
    }
  }, [user])

  return null
}
