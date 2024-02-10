import { useCurrentUser } from '~/hooks'
import { Navigate, Outlet } from 'react-router-dom'
import { routes } from '~/pages'

export function HodRoot() {
    const { role } = useCurrentUser()
    if (role !== 'HoD') return <Navigate to={routes.authRedirect} />
    return (
        <div className='mx-auto flex w-10/12 gap-24 pb-12'>
            <Outlet />
        </div>
    )
}
