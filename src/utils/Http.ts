import Axios from 'axios'
import { useAuthStore } from '@/store'

const instance = Axios.create({
  baseURL: import.meta.env.VITE_REQUEST_BASE_URL
})

instance.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (!config.anonymous && !config.headers.Authorization && authStore.authenticated) {
      config.headers.Authorization = `${authStore.authorization!.tokenType} ${authStore.authorization!.accessToken}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default instance
