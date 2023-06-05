import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from 'stores/auth-store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

api.interceptors.request.use(function (config) {
  const authStore = useAuthStore()
  config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiZmlsaXBlZm94QGdtYWlsLmNvbSIsImlhdCI6MTY4NTcxNTcxNCwiZXhwIjoxNzE3MjczMzE0fQ.PAOyr94u1L1yYom8HSHU4JIX1xi8ipnK4KXy0VHQLEw'
  return config
}, function (error) {
  return Promise.reject(error)
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
