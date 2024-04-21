import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { getCurrentUser, JWTExpiredError, updateAxiosInstanceToken } from '~/backend'
import { DisplayError, Header, MainContentLoading, toast } from '~/components'
import { getCurrentUserFromDTO } from '~/models'
import { routes } from '~/pages'
import { useAuthStore } from '~/store'

export function AuthRoot() {
    const { t } = useTranslation()
    const authStore = useAuthStore()
    if (authStore.accessToken) updateAxiosInstanceToken(authStore.accessToken)
    const navigate = useNavigate()
    const { isLoading, error } = useQuery({
        enabled: !!authStore.accessToken,
        queryKey: ['currentUser'],
        queryFn: async () => {
            if (!authStore.accessToken) return null
            await getCurrentUser(authStore.accessToken)
                .then((u) => authStore.setCurrentUser(getCurrentUserFromDTO(u)))
                .catch((err) => {
                    if (err instanceof JWTExpiredError) {
                        toast(`${t('error.sessionExpiredAuthAgain')}!`)
                    } else if (err instanceof Error) {
                        toast(`${t('error.unknownError')}. Msg: ${err.message}`)
                    } else {
                        toast(`${t('error.unknownError')}.`)
                    }
                    navigate(routes.signIn)
                })
            return null
        },
    })

    if (!authStore.accessToken) return <Navigate to={routes.signIn} />
    if (isLoading || !authStore.currentUser) return <MainContentLoading />
    if (error) return <DisplayError error={error} />

    return (
        <>
            <Header />
            <main className='mx-auto flex h-4/5 w-10/12 justify-center gap-24 pb-12'>
                <Outlet />
            </main>
        </>
    )
}
