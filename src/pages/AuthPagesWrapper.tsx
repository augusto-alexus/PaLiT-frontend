import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { getCurrentUser, JWTExpiredError } from '~/backend'
import { DisplayError, Header, Loading, toast } from '~/components'
import { getCurrentUserFromDTO } from '~/models'
import { routes } from '~/pages'
import { useAuthStore } from '~/store'

export function AuthPagesWrapper() {
    const { t } = useTranslation()
    const authStore = useAuthStore()
    const navigate = useNavigate()
    const { isLoading, error } = useQuery({
        enabled: !!authStore.accessToken,
        queryKey: ['currentUser'],
        queryFn: async () => {
            if (!authStore.accessToken) return
            await getCurrentUser(authStore.accessToken)
                .then((u) => authStore.setCurrentUser(getCurrentUserFromDTO(u)))
                .catch((err) => {
                    if (err instanceof JWTExpiredError) {
                        toast(`${t('error.sessionExpiredAuthAgain')}!`)
                        navigate(routes.signIn)
                    } else if (err instanceof Error) {
                        toast(`${t('error.unknownError')}. Msg: ${err.message}`)
                    } else {
                        toast(`${t('error.unknownError')}.`)
                    }
                })
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
