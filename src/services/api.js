import axios from 'axios'
import router from '../router'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const auth = useAuthStore()
            auth.logout()
            if (router.currentRoute.value.path !== '/') {
                router.push('/')
            } else {
                window.location.reload()
            }
        }
        return Promise.reject(error)
    }
)

export default api