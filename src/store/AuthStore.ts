import { defineStore } from 'pinia'

export default defineStore('auth', {
  state: (): AuthState => ({
    authorization: null
  }),
  getters: {
    authenticated(state) {
      return state.authorization !== null && state.authorization.expireAt > Date.now()
    }
  },
  actions: {
    updateAuthorization(authorization: Authorization) {
      this.authorization = authorization
    },
    destroyAuthorization() {
      this.authorization = null
    }
  },
  persist: {
    storage: sessionStorage
  }
})
