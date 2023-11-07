import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { getCurrentUser, JWTExpiredError } from '~/backend'
import { DisplayError, Loading, toast } from '~/components'
import { getCurrentUserFromDTO } from '~/models'
import { routes } from '~/pages/routes.ts'
import { useAuthStore } from '~/store/authStore.ts'
import { Header } from './page-components'

export function LoggedDashboardWrapper() {
    const { t } = useTranslation()
    const authStore = useAuthStore()
    const navigate = useNavigate()
    const { isLoading, error } = useQuery({
        enabled: !!authStore.accessToken,
        queryKey: ['currentUser'],
        queryFn: async () => {
            if (!authStore.accessToken) return Promise.resolve()
            try {
                const currentUserDTO = await getCurrentUser(
                    authStore.accessToken
                )
                const currentUser = getCurrentUserFromDTO(currentUserDTO)
                authStore.setCurrentUser(currentUser)
                return currentUser
            } catch (error) {
                if (error instanceof JWTExpiredError) {
                    toast(`${t('error.sessionExpiredAuthAgain')}!`)
                    navigate(routes.signIn)
                }
                return null
            }
        },
    })

    if (!authStore.accessToken) return <Navigate to={routes.signIn} />
    if (isLoading || !authStore.currentUser) return <Loading />
    if (error) return <DisplayError error={error} />

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
