import { useContext } from 'react'
import LogRocket from 'logrocket'
import AuthContext from 'contexts/auth-context'

export default function Logrocket() {
  const { user } = useContext(AuthContext)
  if (process.env.NODE_ENV === 'production') {
    if (user) {
      LogRocket.init('dicpce/dopplr')
      LogRocket.identify((Math.random(), 2, 5).toString(), {
        name: user.displayName ?? 'visitor',
        email: user.email ?? 'someone@example.com',
      })
    }
  }
  return null
}
