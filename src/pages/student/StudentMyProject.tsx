import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useMyProject } from '~/hooks'
import { routes, StudentFeed } from '~/pages'
import { SidebarContainer } from '~/pages/components'

export function StudentMyProject() {
    const { t } = useTranslation()
    const { myProjectStarted } = useMyProject()
    if (!myProjectStarted)
        return (
            <div className='flex w-full flex-col gap-8'>
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>{t('workNotStarted.title')}</div>
                <div className='mx-auto max-w-md text-center text-xl text-cs-text-dark'>
                    <Link to={routes.student.aTeachers}>{t('workNotStarted.invite')}</Link>{' '}
                    {t('workNotStarted.teacherOr')}
                    <Link to={routes.common.aInvitations}> {t('workNotStarted.accept')}</Link>{' '}
                    {t('workNotStarted.theRestForStudent')}
                </div>
            </div>
        )

    return (
        <SidebarContainer>
            <StudentFeed />
        </SidebarContainer>
    )
}
