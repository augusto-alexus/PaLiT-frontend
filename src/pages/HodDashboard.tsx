import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '~/hooks'
import { routes } from '~/pages'
import { HodRequests, HodStages } from '~/pages/components'

export function HodDashboard() {
    const { role } = useCurrentUser()

    if (role !== 'HoD') return <Navigate to={`/${routes.authRedirect}`} />

    return (
        <div className='mx-auto flex w-10/12 gap-24'>
            <HodRequests />
            <HodStages />
        </div>
    )
}
