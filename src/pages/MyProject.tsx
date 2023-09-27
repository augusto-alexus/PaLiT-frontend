import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, Outlet } from 'react-router-dom'
import { getMyProject } from '~/backend'
import { useAccessToken } from '~/hooks/useAccessToken'
import { useCurrentUser } from '~/hooks/useCurrentUser'
import { routes } from '~/pages'
import { SidebarContainer } from '~/pages/page-components'

export function MyProject() {
    const currentUser = useCurrentUser()
    const accessToken = useAccessToken()
    const { data } = useQuery({
        enabled: currentUser.role === 'student',
        queryKey: ['myProject'],
        queryFn: () => getMyProject(accessToken),
    })
    if (currentUser.role !== 'student') return <Navigate to='..' />
    const projectExists = !!data && !!data?.advisor?.id
    if (!projectExists)
        return (
            <div className='flex w-full flex-col gap-8'>
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    Ви ще не розпочали свою роботу
                </div>
                <div className='mx-auto max-w-md text-center text-xl text-cs-text-dark'>
                    <Link to={`/${routes.teacherList}`}>Запросіть</Link>{' '}
                    куратора або{' '}
                    <Link to={`/${routes.invitations}`}>прийміть</Link>{' '}
                    запрошення від куратора щоб розпочати працювати над
                    кваліфікаційною роботою
                </div>
            </div>
        )

    return (
        <SidebarContainer>
            <Outlet />
        </SidebarContainer>
    )
}
