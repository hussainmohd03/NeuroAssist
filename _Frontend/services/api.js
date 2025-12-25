import axios from 'axios'
import { BASE_URL } from '../globals'

const Client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
})

const refreshAccessToken = async () => {
  return await Client.post('/api/auth/refresh')
}

let isRefreshing = false
let refreshPromise = null

Client.interceptors.response.use(
  (res) => res,

  async (error) => {
    if (!error.response) return Promise.reject(error)

    const originalRequest = error.config

    if (originalRequest.url.includes('/api/auth/refresh')) {
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        await refreshPromise
        return Client(originalRequest)
      }

      isRefreshing = true
      refreshPromise = refreshAccessToken()

      try {
        await refreshPromise
        return Client(originalRequest)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    }

    return Promise.reject(error)
  }
)

export default Client
