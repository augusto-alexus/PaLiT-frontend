import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '~/hooks'
import { routes } from '~/pages'

export function AuthRedirect() {
    const { role } = useCurrentUser()
    if (role === 'student') return <Navigate to={`/${routes.myProject}`} />
    else if (role === 'teacher') return <Navigate to={`/${routes.myStudents}`} />
    return <Navigate to={routes.hod.aStageApproval} />
}
