import { useCurrentUser } from '~/hooks'
import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '~/pages'

export function TeacherRoot() {
    const { role } = useCurrentUser()
    if (role !== 'teacher') return <Navigate to={routes.aAuthRedirect} />
    return <Outlet />
}
