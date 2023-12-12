import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { getMyStudents } from '~/backend'
import { Loading } from '~/components'
import { useAccessToken, useCurrentUser } from '~/hooks'
import { routes } from '~/pages'
import { SidebarContainer } from '~/pages/components'

export function MyStudent() {
    const { studentId } = useParams()
    const accessToken = useAccessToken()
    const { role } = useCurrentUser()
    const { data: myStudents, isLoading } = useQuery({
        enabled: role === 'teacher',
        queryKey: ['myStudents', studentId],
        queryFn: () => getMyStudents(accessToken),
    })
    if (role !== 'teacher') return <Navigate to={`/${routes.authRedirect}`} />
    const myStudent = myStudents?.find(
        (s) => s.student.studentId.toString() == studentId
    )
    if (isLoading) return <Loading />
    return (
        <SidebarContainer myStudent={myStudent}>
            <Outlet context={{ myStudent }} />
        </SidebarContainer>
    )
}
