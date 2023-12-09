import { useTranslation } from 'react-i18next'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser, useMyProject } from '~/hooks'
import { routes } from '~/pages'
import { SidebarContainer } from './page-components'

export function MyProject() {
    const { t } = useTranslation()
    const { role } = useCurrentUser()
    const { myProjectStarted } = useMyProject()
    if (role !== 'student') return <Navigate to={`/${routes.authRedirect}`} />
    if (!myProjectStarted)
        return (
            <div className='flex w-full flex-col gap-8'>
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    {t('workNotStarted.title')}
                </div>
                <div className='mx-auto max-w-md text-center text-xl text-cs-text-dark'>
                    <Link to={`/${routes.teacherList}`}>
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
