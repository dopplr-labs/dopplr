import Axios from 'axios'
import { auth } from 'utils/firebase'

const client = Axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
})

client.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser
  if (currentUser) {
    const idToken = await currentUser.getIdToken()
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  }
  return config
})

export default client
