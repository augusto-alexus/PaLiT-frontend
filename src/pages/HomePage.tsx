import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from '~/pages/routes.ts'
import { useAuthStore } from '~/store/authStore.ts'
import { useCurrentUser } from '~/backend/useCurrentUser.ts'

export function HomePage() {
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const currentUser = useCurrentUser()

    useEffect(() => {
        if (authStore.accessToken === null) {
            navigate(routes.signIn)
        } else {
            currentUser(authStore.accessToken)
        }
    }, [authStore.accessToken])

    return (
        <main>
            <h1>TODO User info here</h1>
            <h2>Access token: {authStore.accessToken}</h2>
            <button onClick={authStore.resetAccessToken}>
                Reset token (log out)
            </button>
        </main>
    )
}
