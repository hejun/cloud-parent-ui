import Axios, { type AxiosResponse } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/store'
import { obtainRefreshToken } from '@/api/Auth'

const instance = Axios.create({
  baseURL: import.meta.env.VITE_REQUEST_BASE_URL
})

instance.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (!config.headers.Authorization && authStore.authenticated) {
      config.headers.Authorization = `${authStore.authorization!.tokenType} ${authStore.authorization!.accessToken}`
    }
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  async (resp: AxiosResponse<Result, any>) => {
    if (resp.data.code === 200) {
      return resp.data.data
    }
    if (resp.data.code === 401) {
      const authStore = useAuthStore()
      if (authStore.authorization?.refreshToken) {
        const refreshToken = authStore.authorization.refreshToken
        authStore.destroyAuthorization()
        const authorizationToken = await obtainRefreshToken(refreshToken)
        authStore.updateAuthorization(authorizationToken)
        resp.config.headers.Authorization = `${authStore.authorization!.tokenType} ${authStore.authorization!.accessToken}`
        return instance.request(resp.config)
      }
      return router.replace({ path: '/oauth', query: { target: router.currentRoute.value.fullPath } })
    }
    return Promise.reject(resp.data)
  },
  error => Promise.reject(error)
)

export default instance
