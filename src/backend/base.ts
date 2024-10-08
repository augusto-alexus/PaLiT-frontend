import axios from 'axios'

export const baseUrl = import.meta.env.VITE_BACKEND_API_URL as string

console.log(`>>> base url = ${baseUrl}`)

const axiosInstance = axios.create({ baseURL: baseUrl })
export const axiosTokenlessInstance = axios.create({ baseURL: baseUrl })

export function updateAxiosInstanceToken(accessToken: string) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
}

export default axiosInstance
