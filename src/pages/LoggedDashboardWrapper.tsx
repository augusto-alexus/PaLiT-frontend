import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser } from '~/backend'
import { DisplayError, Loading } from '~/components'
import { getCurrentUserFromDTO } from '~/models'
import { routes } from '~/pages/routes.ts'
import { useAuthStore } from '~/store/authStore.ts'
import { BodyInfo, Header } from './page-components'

export function LoggedDashboardWrapper() {
    const authStore = useAuthStore()
    const { isLoading, error } = useQuery({
        enabled: !!authStore.accessToken,
        queryKey: ['currentUser'],
        queryFn: async () => {
            if (!authStore.accessToken) return Promise.resolve()
            const currentUserDTO = await getCurrentUser(authStore.accessToken)
            const currentUser = getCurrentUserFromDTO(currentUserDTO)
            authStore.setCurrentUser(currentUser)
            return currentUser
        },
    })

    if (!authStore.accessToken) return <Navigate to={routes.signIn} />
    if (isLoading) return <Loading />
    if (error) return <DisplayError error={error} />

    return (
        <>
            <Header />
            <BodyInfo>
                <Outlet />
            </BodyInfo>
        </>
    )
}
