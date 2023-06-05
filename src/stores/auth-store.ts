import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null
  }),
  actions: {
    setToken (token: string) {
      this.token = token
    },
    getToken () {
      return this.token
    },
    clearToken () {
      this.token = null
    }
  }
})
