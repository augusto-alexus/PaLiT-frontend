import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '~/hooks'
import { routes } from '~/pages'

export function AuthLanding() {
    const { role } = useCurrentUser()
    if (role === 'student') return <Navigate to={`/${routes.myProject}`} />
    return <Navigate to={routes.studentList} />
}
