import { useCurrentUser } from '~/hooks'
import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '~/pages'

export function StudentRoot() {
    const { role } = useCurrentUser()
    if (role !== 'student') return <Navigate to={routes.aAuthRedirect} />
    return <Outlet />
}
