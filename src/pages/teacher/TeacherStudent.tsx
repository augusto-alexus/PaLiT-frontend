import { Outlet, useSearchParams } from 'react-router-dom'
import { DisplayError, Loading } from '~/components'
import { SidebarContainer } from '~/pages/components'
import { useMyStudent } from '~/hooks'

export function TeacherStudent() {
    const [searchParams] = useSearchParams()
    const studentId = searchParams.get('studentId')
    const { data: myStudent, isInitialLoading } = useMyStudent(studentId)
    if (!studentId) return <DisplayError error={Error("No 'studentId' present")} />
    if (isInitialLoading) return <Loading />
    return (
        <SidebarContainer myStudent={myStudent}>
            <Outlet />
        </SidebarContainer>
    )
}
