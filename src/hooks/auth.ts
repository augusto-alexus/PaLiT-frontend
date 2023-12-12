import { useAuthStore } from '~/store'

export function useAccessToken() {
    const authStore = useAuthStore()
    if (!authStore.accessToken) throw new Error('Access token is empty')
    return authStore.accessToken
}

export function useCurrentUser() {
    const authStore = useAuthStore()
    if (!authStore.currentUser) throw new Error('Current user is empty')
    return authStore.currentUser
}
