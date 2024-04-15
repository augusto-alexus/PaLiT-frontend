import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '~/hooks'
import { routes } from '~/pages'

export function AuthRedirect() {
    const { role } = useCurrentUser()
    if (role === 'student') return <Navigate to={routes.student.aMyProject} />
    else return <Navigate to={routes.common.aMyStudents} />
}
