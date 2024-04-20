import { SidebarContainer } from '~/pages/components'
import { routes, StudentFeed } from '~/pages/index.ts'
import { useCurrentUser, useMyProject, useMyStudent } from '~/hooks'
import { Link, useSearchParams } from 'react-router-dom'
import { DisplayError, MainContentLoading } from '~/components'
import { useTranslation } from 'react-i18next'

export function StudentFeedWrapper() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('studentId')
    const { data: myStudent, isInitialLoading } = useMyStudent(studentId)
    const { myProjectStarted } = useMyProject()

    if (!studentId && role !== 'student') return <DisplayError error={Error("No 'studentId' present")} />
    if (isInitialLoading) return <MainContentLoading />

    if (role === 'student' && !myProjectStarted)
        return (
            <div className='flex w-full flex-col gap-8'>
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>{t('workNotStarted.title')}</div>
                <div className='mx-auto max-w-md text-center text-xl text-cs-text-dark'>
                    <Link to={routes.aInviteTeachers}>{t('workNotStarted.invite')}</Link>{' '}
                    {t('workNotStarted.teacherOr')}
                    <Link to={routes.aInvitations}> {t('workNotStarted.accept')}</Link>{' '}
                    {t('workNotStarted.theRestForStudent')}
                </div>
            </div>
        )

    return (
        <SidebarContainer myStudent={myStudent}>
            <StudentFeed />
        </SidebarContainer>
    )
}
