import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { BodyInfo, Header } from './page-components'
import { useCurrentUser } from '~/backend/useCurrentUser.ts'
import { useAuthStore } from '~/store/authStore.ts'
import { routes } from '~/pages/routes.ts'

export function LoggedDashboardWrapper() {
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
