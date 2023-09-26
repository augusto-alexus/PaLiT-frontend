import { useAuthStore } from '~/store/authStore.ts'

export function useAccessToken() {
    const authStore = useAuthStore()
    if (!authStore.accessToken) throw new Error('Access token is empty')
    return authStore.accessToken
}
