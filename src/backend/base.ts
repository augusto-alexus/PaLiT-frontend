import { AxiosRequestConfig } from 'axios'

export function getAuthConfig(
    accessToken: string,
    config: AxiosRequestConfig = {}
) {
    return {
        ...config,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...config.headers,
        },
    }
}
