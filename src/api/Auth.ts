import { enc } from 'crypto-js'
import { useAuthStore } from '@/store'
import { randomString } from '@/utils/Random'
import http from '@/utils/Http'

const KEY_AUTH_VERIFIER: string = 'CLOUD_OAUTH_CODE_VERIFIER'

export function generateAuthorizationUrl(target: string) {
  const issuer = import.meta.env.VITE_OAUTH_ISSUER
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID
  const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI
  const scope = encodeURIComponent(import.meta.env.VITE_OAUTH_SCOPE)
  const state = enc.Base64.stringify(enc.Utf8.parse(target))
  const nonce = randomString()

  window.sessionStorage.setItem(KEY_AUTH_VERIFIER, JSON.stringify({ nonce: nonce }))

  return `${issuer}/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&nonce=${nonce}`
}

export async function obtainAccessToken(code: string): Promise<Authorization> {
  const issuer = import.meta.env.VITE_OAUTH_ISSUER
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID
  const clientSecret = import.meta.env.VITE_OAUTH_CLIENT_SECRET
  const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI
  const { nonce } = JSON.parse(window.sessionStorage.getItem(KEY_AUTH_VERIFIER) || '{}')
  window.sessionStorage.removeItem(KEY_AUTH_VERIFIER)

  const params = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  }

  const { access_token, refresh_token, id_token, scope, token_type, expires_in } = await http.post<any, any>(
    `${issuer}/oauth2/token`,
    new URLSearchParams(Object.entries(params)),
    {
      auth: {
        username: clientId,
        password: clientSecret
      }
    }
  )

  const userinfo = JSON.parse(enc.Utf8.stringify(enc.Base64.parse(id_token.split('.')[1])))
  if (userinfo.nonce === nonce) {
    const expireAt = new Date()
    expireAt.setSeconds(expireAt.getSeconds() + expires_in)
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      idToken: id_token,
      scope: scope.split(' '),
      tokenType: token_type,
      expireAt: expireAt.getTime()
    }
  }
  return Promise.reject('nonce is invalid')
}

let promise: Promise<Authorization> | null

export async function obtainRefreshToken(refreshToken: string): Promise<Authorization> {
  if (promise) {
    return promise
  }
  const issuer = import.meta.env.VITE_OAUTH_ISSUER
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID
  const clientSecret = import.meta.env.VITE_OAUTH_CLIENT_SECRET
  const params = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  }
  promise = http
    .post<any, any>(`${issuer}/oauth2/token`, new URLSearchParams(Object.entries(params)), {
      auth: {
        username: clientId,
        password: clientSecret
      }
    })
    .then(res => {
      if (res) {
        const { access_token, refresh_token, id_token, scope, token_type, expires_in } = res
        const expireAt = new Date()
        expireAt.setSeconds(expireAt.getSeconds() + expires_in)
        return {
          accessToken: access_token,
          refreshToken: refresh_token,
          idToken: id_token,
          scope: scope.split(' '),
          tokenType: token_type,
          expireAt: expireAt.getTime()
        }
      } else {
        return Promise.reject('Refresh failed')
      }
    })
  promise.finally(() => (promise = null))
  return promise
}

export function logout() {
  const issuer = import.meta.env.VITE_OAUTH_ISSUER
  Promise.resolve()
    .then(() => useAuthStore().destroyAuthorization())
    .then(() => {
      window.location.href = `${issuer}/logout?redirect_uri=${window.location.href}`
    })
}

export function loadUserinfo() {
  const issuer = import.meta.env.VITE_OAUTH_ISSUER
  return http.get<any, Authorization>(`${issuer}/userinfo`)
}
