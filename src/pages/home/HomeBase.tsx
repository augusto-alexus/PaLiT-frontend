import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header, BodyInfo } from '~/components'
import { routes } from '~/pages/routes.ts'
import { useAuthStore } from '~/store/authStore.ts'
import { useCurrentUser } from '~/backend/useCurrentUser.ts'

export function HomeBase() {
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const currentUser = useCurrentUser((userData) =>
        authStore.setCurrentUser(userData)
    )

    useEffect(() => {
        if (authStore.accessToken === null) {
            navigate(routes.signIn)
        } else {
            currentUser(authStore.accessToken)
        }
    }, [authStore.accessToken])

    return (
        <>
            <Header />
            <BodyInfo>
                <Outlet />
            </BodyInfo>
        </>
    )
}
