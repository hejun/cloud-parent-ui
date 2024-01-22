declare interface Authorization {
  accessToken: string
  refreshToken: string
  idToken: string
  scope: string[]
  tokenType: string
  expireAt: number
}
