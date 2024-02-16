import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '~/hooks'
import { routes } from '~/pages'

export function AuthRedirect() {
    const { role } = useCurrentUser()
    if (role === 'student') return <Navigate to={routes.student.aMyProject} />
    else if (role === 'teacher') return <Navigate to={routes.teacher.aMyStudents} />
    else if (role === 'PS') return <Navigate to={routes.ps.aStudents} />
    return <Navigate to={routes.hod.aProjects} />
}
