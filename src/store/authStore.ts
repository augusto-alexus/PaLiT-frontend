import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

interface IAuthState {
    accessToken: string | null
    setAccessToken: (token: string) => void
    resetAccessToken: () => void
}

export const useAuthStore = create<IAuthState>()(
    persist(
        devtools(
            (set) => ({
                accessToken: null,
                setAccessToken: (token: string) =>
                    set(
                        () => ({ accessToken: token }),
                        false,
                        'setAccessToken'
                    ),
                resetAccessToken: () =>
                    set(
                        () => ({ accessToken: null }),
                        false,
                        'resetAccessToken'
                    ),
            }),
            { name: 'Auth Store' }
        ),
        {
            name: 'auth-storage',
        }
    )
)
