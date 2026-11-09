
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8090/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Automatically attach access token to API requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('safeherAccessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
