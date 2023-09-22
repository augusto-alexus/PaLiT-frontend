import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ICurrentUser } from '~/models'

interface IAuthState {
    accessToken: string | null
    currentUser: ICurrentUser | null
    setAccessToken: (token: string) => void
    setCurrentUser: (user: ICurrentUser) => void
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
                setCurrentUser: (user: ICurrentUser) =>
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
