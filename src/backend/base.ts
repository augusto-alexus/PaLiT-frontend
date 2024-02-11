import axios from 'axios'

export const baseUrl = 'http://localhost:8080/api'

const axiosInstance = axios.create({ baseURL: baseUrl })

export function updateAxiosInstanceToken(accessToken: string) {
    axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`,
    }
}

export default axiosInstance
