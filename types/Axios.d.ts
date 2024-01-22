import 'axios'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    anonymous: boolean
  }
}
