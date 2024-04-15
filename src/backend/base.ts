import axios from 'axios'

export const baseUrl = 'http://localhost:8080/api'
// export const baseUrl = 'http://3.70.181.134/api'
// export const baseUrl = 'http://192.168.181.55:8080/api'

const axiosInstance = axios.create({ baseURL: baseUrl })
export const axiosTokenlessInstance = axios.create({ baseURL: baseUrl })

export function updateAxiosInstanceToken(accessToken: string) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`
}

export default axiosInstance
