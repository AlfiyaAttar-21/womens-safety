import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8090/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('safeherAccessToken')

    console.log('API REQUEST:', config.url)
    console.log('TOKEN EXISTS:', !!token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(
      'AUTHORIZATION HEADER EXISTS:',
      !!config.headers.Authorization
    )

    return config
  },
  (error) => Promise.reject(error)
)

export default api