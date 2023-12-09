import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '~/hooks'
import { HodRequests } from '~/pages/page-components'
import { HodStages } from '~/pages/page-components/HodStages.tsx'
import { routes } from '~/pages/routes.ts'

export function Dashboard() {
    const { role } = useCurrentUser()

    if (role !== 'HoD') return <Navigate to={`/${routes.authRedirect}`} />

    return (
        <div className='mx-auto flex w-10/12 gap-24'>
            <HodRequests />
            <HodStages />
        </div>
    )
}
