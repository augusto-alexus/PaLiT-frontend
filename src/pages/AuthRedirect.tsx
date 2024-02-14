import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '~/hooks'
import { routes } from '~/pages'

export function AuthRedirect() {
    const { role } = useCurrentUser()
    if (role === 'student') return <Navigate to={routes.student.aMyProject} />
    else if (role === 'teacher') return <Navigate to={routes.teacher.aMyStudents} />
    return <Navigate to={routes.hod.aStageApproval} />
}
