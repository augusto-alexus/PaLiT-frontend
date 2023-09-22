import { useAuthStore } from '~/store/authStore.ts'

export function useCurrentUser() {
    const authStore = useAuthStore()
    if (!authStore.currentUser) throw new Error('Current user is empty')
    return authStore.currentUser
}
