import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { ICurrentUserDTO } from '~/backend/useCurrentUser.ts'

interface IAuthState {
    accessToken: string | null
    currentUser: ICurrentUserDTO | null
    setAccessToken: (token: string) => void
    setCurrentUser: (user: ICurrentUserDTO) => void
    reset: () => void
}

export const useAuthStore = create<IAuthState>()(
    persist(
        devtools(
            (set) => ({
                accessToken: null,
                currentUser: null,
                setAccessToken: (token: string) =>
                    set(
                        () => ({ accessToken: token }),
                        false,
                        'setAccessToken'
                    ),
                setCurrentUser: (user: ICurrentUserDTO) =>
                    set(() => ({ currentUser: user }), false, 'setCurrentUser'),
                reset: () =>
                    set(
                        () => ({ currentUser: null, accessToken: null }),
                        false,
                        'reset'
                    ),
            }),
            { name: 'Auth Store' }
        ),
        {
            name: 'auth-storage',
        }
    )
)
