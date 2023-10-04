import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { getMyProject } from '~/backend'
import { useAccessToken } from '~/hooks/useAccessToken'
import { useCurrentUser } from '~/hooks/useCurrentUser'
import { routes } from '~/pages'
import { SidebarContainer } from '~/pages/page-components'

export function MyProject() {
    const { t } = useTranslation()
    const currentUser = useCurrentUser()
    const accessToken = useAccessToken()
    const { data } = useQuery({
        enabled: currentUser.role === 'student',
        queryKey: ['myProject'],
        queryFn: () => getMyProject(accessToken),
    })
    if (currentUser.role !== 'student')
        return <Navigate to={`/${routes.authRedirect}`} />
    const projectExists = !!data && !!data?.advisor?.id
    if (!projectExists)
        return (
            <div className='flex w-full flex-col gap-8'>
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('workNotStarted.title')}
                </div>
                <div className='mx-auto max-w-md text-center text-xl text-cs-text-dark'>
                    <Link to={`/${routes.studentList}`}>
                        {t('workNotStarted.invite')}
                    </Link>{' '}
                    {t('workNotStarted.teacherOr')}
                    <Link to={`/${routes.invitations}`}>
                        {' '}
                        {t('workNotStarted.accept')}
                    </Link>{' '}
                    {t('workNotStarted.theRestForStudent')}
                </div>
            </div>
        )

    return (
        <SidebarContainer>
            <Outlet />
        </SidebarContainer>
    )
}
